import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [city, setCity] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [currentCity, setCurrentCity] = useState('')
  const [progress, setProgress] = useState(0)

  // Simulação de progresso durante o carregamento
  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            return prev
          }
          return prev + Math.random() * 15
        })
      }, 200)
      return () => clearInterval(interval)
    } else {
      setProgress(100)
      setTimeout(() => setProgress(0), 500)
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
representando de forma clara a cidade de [CITY]. Inclua marcos e atrações turísticas icônicas 
(assim como: a Praia do Futuro, o Mercado Central, a Catedral Metropolitana de Fortaleza, 
a Ponte dos Ingleses, o Centro Dragão do Mar de Arte e Cultura, entre outros edifícios 
característicos).

Use texturas suaves e refinadas, com materiais PBR realistas, iluminação natural delicada 
e sombras suaves, refletindo as condições climáticas atuais da cidade para criar uma atmosfera imersiva. 
Mantenha a composição limpa e minimalista, com fundo em cor sólida.

No topo central da imagem, coloque o título "[CITY]" em texto grande e negrito, seguido de um ícone 
de clima destacado logo abaixo. Adicione também a data (em texto pequeno) e a temperatura (em texto médio), 
todos centralizados e com espaçamento consistente, podendo sobrepor levemente o topo das edificações.

A imagem deve ter proporção quadrada, 1080 × 1080 pixels.
`.replace(/\[CITY\]/g, cleanCity)
      
      const { data } = await axios.post(`${API_BASE_URL}/generate-image`, {
        prompt: prompt,
      })
      setResult(data)
      setProgress(100)
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Erro desconhecido'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const imageBase64 = result?.data?.image_base64
  const imageText = result?.data?.text

  return (
    <div className="app-shell">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="logo-badge">
            <span className="logo-icon">🏙️</span>
            <span className="logo-text">IsoScape</span>
          </div>
          <h1 className="hero-title">
            Transforme qualquer cidade em uma
            <span className="gradient-text"> obra de arte isométrica</span>
          </h1>
          <p className="hero-subtitle">
            Crie ilustrações 3D únicas e personalizadas de cidades usando inteligência artificial. 
            Perfeito para apresentações, marketing e projetos criativos.
          </p>
          <div className="hero-badges">
            <div className="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>IA Avançada</span>
            </div>
            <div className="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>Geração Rápida</span>
            </div>
            <div className="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>Alta Qualidade</span>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Design Único</h3>
            <p>Cada cidade é representada com marcos icônicos e características únicas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Geração Instantânea</h3>
            <p>Obtenha sua ilustração em segundos com tecnologia de IA de ponta</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Estilo Isométrico</h3>
            <p>Visual moderno e profissional em perspectiva isométrica 3D</p>
          </div>
        </div>
      </section>


      {/* Generator Section */}
      <section className="generator-section">
        <div className="generator-card">
          <div className="generator-header">
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

          {/* Progress Bar */}
          {isLoading && (
            <div className="progress-container">
              <div className="progress-bar-wrapper">
                <div 
                  className="progress-bar" 
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <p className="progress-text">
                Criando sua ilustração isométrica de <strong>{currentCity}</strong>...
              </p>
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
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Powered by <span className="footer-highlight">Gemini AI</span> • 
          Criado com ❤️ para transformar ideias em arte
        </p>
      </footer>
    </div>
  )
}

export default App
