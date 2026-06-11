// src/pages/RedefinirSenha.jsx

import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/apiService'

function RedefinirSenha() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')

  const [senha, setSenha] = useState('')
  const [confirma, setConfirma] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(false)

  const inputStyle = {
    padding: '10px', width: '300px', marginTop: '5px',
    background: '#222', color: 'white', border: '1px solid white'
  }

  async function enviar() {
    if (!senha || !confirma) { setErro('Preencha os dois campos.'); return }
    if (senha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres.'); return }
    if (senha !== confirma) { setErro('As senhas não coincidem.'); return }
    setErro(null)
    setEnviando(true)
    try {
      await authService.redefinirSenha(token, senha)
      setSucesso(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setErro(err.message || 'Não foi possível redefinir a senha.')
    } finally {
      setEnviando(false)
    }
  }

  if (!token) {
    return (
      <div className="container">
        <h2 style={{ marginBottom: '20px' }}>Redefinir senha</h2>
        <p style={{ color: 'red', marginBottom: '15px' }}>Link inválido (token ausente).</p>
        <Link to="/esqueci-senha" style={{ color: 'orange' }}>Solicitar novo link</Link>
      </div>
    )
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px' }}>Redefinir senha</h2>

      {erro && <p style={{ color: 'red', marginBottom: '15px' }}>{erro}</p>}

      {sucesso ? (
        <p style={{ color: '#8ee29f' }}>
          ✓ Senha redefinida com sucesso! Redirecionando para o login...
        </p>
      ) : (
        <>
          <div style={{ marginBottom: '15px' }}>
            <label>Nova senha:</label><br />
            <input type="password" value={senha}
              onChange={e => setSenha(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Confirmar nova senha:</label><br />
            <input type="password" value={confirma}
              onChange={e => setConfirma(e.target.value)} style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && enviar()} />
          </div>
          <button onClick={enviar} disabled={enviando}>
            {enviando ? 'Salvando...' : 'Redefinir senha'}
          </button>
        </>
      )}
    </div>
  )
}

export default RedefinirSenha
