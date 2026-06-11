// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CarrinhoProvider } from './context/CarrinhoContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Produtos from './pages/Produtos'
import Produto from './pages/Produto'
import Carrinho from './pages/Carrinho'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import MeusPedidos from './pages/MeusPedidos'

function RotaProtegida({ children }) {
  const { usuario } = useAuth()
  return usuario ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/checkout" element={
          <RotaProtegida><Checkout /></RotaProtegida>
        } />
        <Route path="/meus-pedidos" element={
          <RotaProtegida><MeusPedidos /></RotaProtegida>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarrinhoProvider>
          <AppRoutes />
        </CarrinhoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App