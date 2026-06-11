// src/pages/Login.jsx

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// URL do painel administrativo (app separado). Configurável por env.
const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  const inputStyle = {
    padding: '10px', width: '300px', marginTop: '5px',
    background: '#222', color: 'white', border: '1px solid white'
  }

  async function fazerLogin() {
    if (!email || !senha) { setErro('Preencha todos os campos!'); return }
    setErro(null)
    setCarregando(true)
    try {
      await login(email, senha)
      navigate('/produtos')
    } catch (err) {
      setErro(err.message || 'Email ou senha incorretos.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px' }}>Login</h2>

      {erro && <p style={{ color: 'red', marginBottom: '15px' }}>{erro}</p>}

      <div style={{ marginBottom: '15px' }}>
        <label>Email:</label><br />
        <input type="email" value={email}
          onChange={e => setEmail(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Senha:</label><br />
        <input type="password" value={senha}
          onChange={e => setSenha(e.target.value)} style={inputStyle}
          onKeyDown={e => e.key === 'Enter' && fazerLogin()} />
      </div>

      <button onClick={fazerLogin} disabled={carregando} style={{ marginBottom: '10px' }}>
        {carregando ? 'Entrando...' : 'Entrar'}
      </button>

      <p style={{ marginBottom: '15px' }}>
        <Link to="/esqueci-senha" style={{ color: '#aaa', fontSize: '14px' }}>
          Esqueci minha senha
        </Link>
      </p>

      <p style={{ marginTop: '5px' }}>
        Não tem conta?{' '}
        <Link to="/cadastro" style={{ color: 'orange' }}>Cadastre-se</Link>
      </p>

      <div style={{
        marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #333',
        maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto'
      }}>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '10px' }}>É administrador?</p>
        <a href={ADMIN_URL}>
          <button type="button" style={{ background: '#333' }}>
            Acesso administrativo
          </button>
        </a>
      </div>
    </div>
  )
}

export default Login