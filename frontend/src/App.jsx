import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [city, setCity] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

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

    try {
      const { data } = await axios.post(`${API_BASE_URL}/generate-isometric`, {
        city_name: cleanCity,
      })
      setResult(data)
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Erro desconhecido'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const imageBase64 = result?.image_base64
  const imageDescription = result?.image_description || result?.data

  return (
    <div className="app-shell">
      <header className="hero">
        <p>IsoScape</p>
        <h1>Gerador Isométrico de Cidades</h1>
        <small>powered by Gemini</small>
      </header>

      <section className="form-card">
        <form onSubmit={handleSubmit}>
          <label htmlFor="city-input">Cidade</label>
          <input
            id="city-input"
            type="text"
            placeholder="Ex: São Paulo"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            autoComplete="off"
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Gerando...' : 'Gerar visão isométrica'}
          </button>
        </form>

        {error && <p style={{ color: '#ff8996' }}>{error}</p>}

        {result && (
          <div className="response-card">
            <h3>Resultado</h3>
            {imageBase64 && (
              <img
                className="image-preview"
                src={`data:image/png;base64,${imageBase64}`}
                alt={`Isometric view of ${result.city_name}`}
              />
            )}
            {imageDescription && <p>{imageDescription}</p>}
          </div>
        )}
      </section>
    </div>
  )
}

export default App
