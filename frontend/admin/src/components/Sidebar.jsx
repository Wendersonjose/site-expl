// src/components/Sidebar.jsx

import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/', rotulo: 'Dashboard', fim: true },
  { to: '/produtos', rotulo: 'Produtos' },
  { to: '/categorias', rotulo: 'Categorias' },
  { to: '/usuarios', rotulo: 'Usuários' },
]

function Sidebar() {
  const { usuario, logout } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Expl<span>💥</span> Admin</div>

      <nav>
        {LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.fim}
            className={({ isActive }) => (isActive ? 'ativo' : '')}
          >
            {link.rotulo}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-rodape">
        <div className="usuario">{usuario?.nome || usuario?.email}</div>
        <button className="secundario" style={{ width: '100%' }} onClick={logout}>
          Sair
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
