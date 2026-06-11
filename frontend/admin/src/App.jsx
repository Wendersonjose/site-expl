// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Produtos from './pages/Produtos'
import Categorias from './pages/Categorias'
import Usuarios from './pages/Usuarios'

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  )
}

function AppRoutes() {
  const { usuario } = useAuth()

  // Sem usuário admin logado, só existe a tela de login.
  if (!usuario) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
