// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/apiService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const salvo = localStorage.getItem('usuario')
    if (token && salvo) {
      try {
        setUsuario(JSON.parse(salvo))
      } catch {
        localStorage.removeItem('usuario')
        localStorage.removeItem('token')
      }
    }
    setCarregando(false)
  }, [])

  async function login(email, senha) {
    const dados = await authService.login(email, senha)
    const user = dados.usuario || dados.user || { email }
    localStorage.setItem('token', dados.token)
    localStorage.setItem('usuario', JSON.stringify(user))
    setUsuario(user)
    return dados
  }

  async function cadastrar(nome, email, senha) {
    const dados = await authService.cadastrar(nome, email, senha)
    const user = dados.usuario || dados.user || { nome, email }
    localStorage.setItem('token', dados.token)
    localStorage.setItem('usuario', JSON.stringify(user))
    setUsuario(user)
    return dados
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  if (carregando) return null

  return (
    <AuthContext.Provider value={{ usuario, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}