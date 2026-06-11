// src/components/Navbar.jsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarrinho } from '../context/CarrinhoContext'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { totalItens } = useCarrinho()
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
    setMenuAberto(false)
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={() => setMenuAberto(false)}>
        Expl💥
      </Link>

      <button
        className="navbar-hamburger"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Menu"
      >
        {menuAberto ? '✕' : '☰'}
      </button>

      <div className={`navbar-links ${menuAberto ? 'navbar-links--aberto' : ''}`}>
        <Link to="/produtos" onClick={() => setMenuAberto(false)}>Produtos</Link>

        <Link to="/carrinho" onClick={() => setMenuAberto(false)} className="navbar-carrinho">
          Carrinho
          {totalItens > 0 && (
            <span className="navbar-badge">{totalItens}</span>
          )}
        </Link>

        {usuario ? (
          <>
            <Link to="/meus-pedidos" onClick={() => setMenuAberto(false)}>
              Meus Pedidos
            </Link>
            <span className="navbar-usuario">
              Olá, {usuario.name || usuario.nome || 'Usuário'}
            </span>
            <button className="navbar-btn-logout" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" onClick={() => setMenuAberto(false)}>Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar