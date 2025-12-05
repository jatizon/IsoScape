import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import logoImage from '../../images/logo.png'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Generator() {
  const navigate = useNavigate()
  const [city, setCity] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [currentCity, setCurrentCity] = useState('')
  const [progress, setProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const startTimeRef = useRef(null)
  const progressIntervalRef = useRef(null)

  // Função para calcular progresso realista baseado no tempo decorrido
  const calculateRealisticProgress = (elapsedSeconds) => {
    // Estimativa de tempo total: 20 segundos
    const totalEstimatedTime = 20
    
    // Curva de progresso usando função de easing (ease-out-cubic)
    // Começa rápido e desacelera no final
    let normalizedTime = Math.min(elapsedSeconds / totalEstimatedTime, 0.95)
    
    // Aplicar curva ease-out-cubic: 1 - (1 - t)^3
    let progressValue = 1 - Math.pow(1 - normalizedTime, 3)
    
    // Converter para porcentagem (0-95%, nunca chega a 100% até a requisição terminar)
    return Math.min(progressValue * 95, 95)
  }

  // Simulação de progresso durante o carregamento
  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      setEstimatedTime(20) // Estimativa inicial de 20 segundos
      startTimeRef.current = Date.now()
      
      progressIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        const newProgress = calculateRealisticProgress(elapsed)
        setProgress(newProgress)
        
        // Calcular tempo estimado restante
        if (newProgress < 95) {
          const remainingProgress = 95 - newProgress
          const progressRate = newProgress / elapsed
          const estimatedRemaining = remainingProgress / (progressRate || 0.1)
          setEstimatedTime(Math.max(1, Math.ceil(estimatedRemaining)))
        } else {
          setEstimatedTime(0)
        }
      }, 100) // Atualizar a cada 100ms para suavidade
      
      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
        }
      }
    } else {
      // Quando terminar, completar imediatamente
      setProgress(100)
      setEstimatedTime(0)
      setTimeout(() => {
        setProgress(0)
      }, 1000)
    }
  }, [isLoading])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const cleanCity = city.trim()

    if (!cleanCity) {
      setError('Informe o nome de uma cidade.')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)
    setCurrentCity(cleanCity)

    try {
      const prompt = `
CITY = ${cleanCity}

Crie uma cena isométrica em miniatura 3D no estilo cartoon, vista em ângulo de 45°, 
representando de forma clara a cidade de [CITY]. Inclua marcos e atrações turísticas icônicas.

Use texturas suaves e refinadas, com materiais PBR realistas, iluminação natural delicada 
e sombras suaves, refletindo as condições climáticas atuais da cidade para criar uma atmosfera imersiva. 
Mantenha a composição limpa e minimalista, com fundo em cor sólida.

No topo central da imagem, coloque o título "[CITY]" em texto médio e negrito, podendo sobrepor levemente o topo das edificações.

A imagem deve ter proporção quadrada, 1080 × 1080 pixels.
`.replace(/\[CITY\]/g, cleanCity)
      
      const { data } = await axios.post(`${API_BASE_URL}/generate-image`, {
        prompt: prompt,
      })
      setResult(data)
      setProgress(100)
      setEstimatedTime(0)
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Erro desconhecido'
      setError(message)
    } finally {
      setIsLoading(false)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }

  const imageBase64 = result?.data?.image_base64
  const imageText = result?.data?.text

  return (
    <div className="generator-page">
      <div className="generator-page-bg"></div>
      
      {/* Header com botão de voltar */}
      <header className="generator-header-section">
        <button className="back-button" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar
        </button>
        <div className="logo-badge">
          <img src={logoImage} alt="IsoScape Logo" className="logo-icon" />
          <span className="logo-text">IsoScape</span>
        </div>
      </header>

      {/* Generator Section */}
      <main className="generator-main">
        <div className="generator-container">
          <div className="generator-content">
            <div className="generator-title-section">
              <h2>Crie sua ilustração agora</h2>
              <p>Digite o nome de uma cidade e veja a mágica acontecer</p>
            </div>

            <form onSubmit={handleSubmit} className="generator-form">
              <div className="input-wrapper">
                <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <input
                  type="text"
                  placeholder="Ex: São Paulo, Paris, Tokyo, Nova York..."
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  autoComplete="off"
                  disabled={isLoading}
                  className="city-input"
                />
              </div>

              <button type="submit" disabled={isLoading} className="generate-button">
                {isLoading ? (
                  <>
                    <span className="button-spinner"></span>
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                    <span>Gerar Ilustração</span>
                  </>
                )}
              </button>
            </form>

            {/* Progress Bar melhorada */}
            {isLoading && (
              <div className="progress-container">
                <div className="progress-bar-wrapper">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="progress-info">
                  <p className="progress-text">
                    Criando sua ilustração isométrica de <strong>{currentCity}</strong>...
                  </p>
                  <div className="progress-stats">
                    <span className="progress-percentage">{Math.round(progress)}%</span>
                    {estimatedTime > 0 && (
                      <span className="progress-time">~{estimatedTime}s restantes</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {result && imageBase64 && (
              <div className="result-card">
                <div className="result-header">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    Ilustração de {currentCity}
                  </h3>
                </div>
                <div className="image-wrapper">
                  <img
                    className="result-image"
                    src={`data:image/png;base64,${imageBase64}`}
                    alt={`Isometric view of ${currentCity}`}
                  />
                </div>
                {imageText && (
                  <div className="result-description">
                    <p>{imageText}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="generator-footer">
        <p>
          Powered by <span className="footer-highlight">Gemini AI</span> • 
          Criado com ❤️ para transformar ideias em arte
        </p>
      </footer>
    </div>
  )
}

export default Generator
