// src/pages/Login.jsx

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)

  async function entrar(e) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)
    try {
      await login(email, senha)
      // O redirecionamento acontece sozinho: App detecta o usuário logado.
    } catch (err) {
      setErro(err.message || 'Falha ao entrar.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-tela">
      <form className="login-card" onSubmit={entrar}>
        <h1>Expl💥 Admin</h1>
        <p className="subtitulo">Painel administrativo</p>

        {erro && <div className="aviso erro">{erro}</div>}

        <div className="campo">
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@explosion.com"
            autoComplete="username"
          />
        </div>

        <div className="campo">
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" disabled={carregando} style={{ width: '100%' }}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

export default Login
