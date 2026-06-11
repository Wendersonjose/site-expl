// src/context/AuthContext.jsx

import { createContext, useContext, useState } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

function lerUsuarioSalvo() {
  try {
    const salvo = localStorage.getItem('admin_user')
    return salvo ? JSON.parse(salvo) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerUsuarioSalvo)

  async function login(email, senha) {
    const { user, token } = await authApi.login(email, senha)

    // O painel é exclusivo de administradores.
    if (user.perfil !== 'admin') {
      throw new Error('Acesso restrito a administradores.')
    }

    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_user', JSON.stringify(user))
    setUsuario(user)
    return user
  }

  function logout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
