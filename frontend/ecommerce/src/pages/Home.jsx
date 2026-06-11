// src/pages/Home.jsx

import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #111 0%, #1a1a1a 50%, #222 100%)',
        padding: '80px 30px',
        textAlign: 'center',
        borderBottom: '2px solid orange'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>
          Expl💥 Energy Drink
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '32px' }}>
          Energia explosiva para o seu dia. Sabores incríveis, performance máxima.
        </p>
        <Link to="/produtos">
          <button style={{ fontSize: '18px', padding: '16px 40px' }}>
            Ver Produtos
          </button>
        </Link>
      </div>

      <div style={{ padding: '60px 30px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '40px' }}>Por que escolher a Expl💥?</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {[
            { icone: '⚡', titulo: 'Alta Energia', texto: 'Fórmula desenvolvida para máxima performance' },
            { icone: '🍓', titulo: 'Vários Sabores', texto: 'Morango, Uva, Açaí, Citrus, Mango e muito mais' },
            { icone: '🚀', titulo: 'Entrega Rápida', texto: 'Receba em casa com agilidade e segurança' },
          ].map(card => (
            <div key={card.titulo} style={{
              background: '#1a1a1a', border: '1px solid #333',
              borderRadius: '8px', padding: '24px'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{card.icone}</div>
              <h3 style={{ marginBottom: '8px', color: 'orange' }}>{card.titulo}</h3>
              <p style={{ color: '#aaa', fontSize: '14px' }}>{card.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home