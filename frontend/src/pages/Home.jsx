import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImage from '../../images/logo.png'

function Home() {
  const heroRef = useRef(null)
  const navigate = useNavigate()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Mouse tracking para background degradê
  useEffect(() => {
    let rafId = null
    
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        if (rafId) {
          cancelAnimationFrame(rafId)
        }
        
        rafId = requestAnimationFrame(() => {
          const rect = heroRef.current.getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 100
          const y = ((e.clientY - rect.top) / rect.height) * 100
          setMousePosition({ x, y })
          
          const orbs = heroRef.current.querySelectorAll('.gradient-orb')
          orbs.forEach((orb) => {
            orb.style.setProperty('--mouse-x', x.toString())
            orb.style.setProperty('--mouse-y', y.toString())
          })
        })
      }
    }

    const hero = heroRef.current
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove, { passive: true })
      return () => {
        hero.removeEventListener('mousemove', handleMouseMove)
        if (rafId) {
          cancelAnimationFrame(rafId)
        }
      }
    }
  }, [])

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll('.scroll-animate')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section')
    if (pricingSection) {
      const rect = pricingSection.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const sectionHeight = rect.height
      
      // Calcular a posição para centralizar a seção na tela
      // Se a seção for maior que a viewport, alinhar ao topo
      // Se for menor, centralizar verticalmente
      const offset = sectionHeight > viewportHeight 
        ? 0 
        : (viewportHeight - sectionHeight) / 2
      
      const scrollPosition = window.pageYOffset + rect.top - offset
      
      window.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      })
    }
  }

  const handlePlanClick = () => {
    navigate('/generator')
  }

  return (
    <div className="app-shell">
      {/* Hero Section */}
      <header className="hero-section" ref={heroRef}>
        <div 
          className="hero-background"
          style={{
            '--mouse-x': `${mousePosition.x}%`,
            '--mouse-y': `${mousePosition.y}%`
          }}
        >
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
          <div className="gradient-orb orb-4"></div>
          <div className="gradient-orb orb-5"></div>
          <div className="gradient-orb orb-6"></div>
        </div>
        <div className="hero-gradient-overlay"></div>
        <div className="hero-content">
          <div className="logo-badge">
            <img src={logoImage} alt="IsoScape Logo" className="logo-icon" />
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

      {/* Stats Section */}
      <section className="stats-section scroll-animate">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Ilustrações Criadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Cidades Disponíveis</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfação dos Usuários</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Disponibilidade</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section scroll-animate">
        <div className="section-header">
          <h2 className="section-title">Por que escolher IsoScape?</h2>
          <p className="section-subtitle">Tecnologia de ponta para criar ilustrações únicas</p>
        </div>
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
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global</h3>
            <p>Suporte para cidades de todo o mundo com precisão geográfica</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalizável</h3>
            <p>Adapte as ilustrações às suas necessidades e preferências</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Alta Resolução</h3>
            <p>Imagens em qualidade profissional prontas para impressão</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section scroll-animate">
        <div className="section-header">
          <h2 className="section-title">O que nossos usuários dizem</h2>
          <p className="section-subtitle">Depoimentos de quem já experimentou</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">"Incrível como a IA consegue capturar a essência de cada cidade. Usei para um projeto de marketing e o resultado foi perfeito!"</p>
            <div className="testimonial-author">
              <div className="author-avatar">MC</div>
              <div className="author-info">
                <div className="author-name">Maria Costa</div>
                <div className="author-role">Designer Gráfico</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">"A velocidade de geração é impressionante. Em segundos tenho uma ilustração profissional pronta para usar."</p>
            <div className="testimonial-author">
              <div className="author-avatar">JS</div>
              <div className="author-info">
                <div className="author-name">João Silva</div>
                <div className="author-role">Desenvolvedor</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">"Perfeito para apresentações e materiais de marketing. A qualidade das ilustrações superou minhas expectativas."</p>
            <div className="testimonial-author">
              <div className="author-avatar">AS</div>
              <div className="author-info">
                <div className="author-name">Ana Santos</div>
                <div className="author-role">Gerente de Marketing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Experimentar Grátis acima dos planos */}
      <section className="cta-section scroll-animate">
        <div className="cta-content">
          <h2 className="cta-title">Pronto para começar?</h2>
          <p className="cta-subtitle">Crie sua primeira ilustração isométrica agora mesmo, sem necessidade de cadastro</p>
          <button className="cta-button" onClick={scrollToPricing}>Experimentar Grátis</button>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="pricing-section scroll-animate">
        <div className="section-header">
          <h2 className="section-title">Planos e Preços</h2>
          <p className="section-subtitle">Escolha o plano ideal para suas necessidades</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-header">
              <h3 className="pricing-name">Básico</h3>
              <div className="pricing-price">
                <span className="price-amount">Grátis</span>
              </div>
            </div>
            <ul className="pricing-features">
              <li>✓ 5 ilustrações por mês</li>
              <li>✓ Resolução padrão</li>
              <li>✓ Cidades populares</li>
              <li>✓ Suporte por email</li>
            </ul>
            <button className="pricing-button" onClick={handlePlanClick}>Começar Grátis</button>
          </div>
          <div className="pricing-card featured">
            <div className="pricing-badge">Mais Popular</div>
            <div className="pricing-header">
              <h3 className="pricing-name">Profissional</h3>
              <div className="pricing-price">
                <span className="price-currency">R$</span>
                <span className="price-amount">29</span>
                <span className="price-period">/mês</span>
              </div>
            </div>
            <ul className="pricing-features">
              <li>✓ Ilustrações ilimitadas</li>
              <li>✓ Alta resolução</li>
              <li>✓ Todas as cidades</li>
              <li>✓ Suporte prioritário</li>
              <li>✓ Download em múltiplos formatos</li>
            </ul>
            <button className="pricing-button primary" onClick={handlePlanClick}>Assinar Agora</button>
          </div>
          <div className="pricing-card">
            <div className="pricing-header">
              <h3 className="pricing-name">Empresarial</h3>
              <div className="pricing-price">
                <span className="price-currency">R$</span>
                <span className="price-amount">99</span>
                <span className="price-period">/mês</span>
              </div>
            </div>
            <ul className="pricing-features">
              <li>✓ Tudo do Profissional</li>
              <li>✓ API personalizada</li>
              <li>✓ Suporte dedicado</li>
              <li>✓ Customizações avançadas</li>
              <li>✓ SLA garantido</li>
            </ul>
            <button className="pricing-button" onClick={handlePlanClick}>Falar com Vendas</button>
          </div>
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

export default Home

