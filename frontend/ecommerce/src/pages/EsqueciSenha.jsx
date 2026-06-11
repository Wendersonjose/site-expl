// src/pages/EsqueciSenha.jsx

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/apiService'

function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState(null)
  const [erro, setErro] = useState(null)
  const [devLink, setDevLink] = useState(null)

  const inputStyle = {
    padding: '10px', width: '300px', marginTop: '5px',
    background: '#222', color: 'white', border: '1px solid white'
  }

  async function enviar() {
    if (!email) { setErro('Informe seu e-mail.'); return }
    setErro(null)
    setEnviando(true)
    try {
      const data = await authService.esqueciSenha(email)
      setMensagem('Se o e-mail estiver cadastrado, enviamos um link de redefinição (válido por 1 hora).')
      // Em desenvolvimento (sem SMTP), a API devolve o link para teste.
      if (data?.devResetUrl) setDevLink(data.devResetUrl)
    } catch (err) {
      setErro(err.message || 'Erro ao solicitar redefinição.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px' }}>Esqueci minha senha</h2>

      {erro && <p style={{ color: 'red', marginBottom: '15px' }}>{erro}</p>}

      {mensagem ? (
        <>
          <p style={{ color: '#8ee29f', marginBottom: '15px' }}>{mensagem}</p>
          {devLink && (
            <p style={{ marginBottom: '15px', fontSize: '13px', color: '#aaa' }}>
              [modo dev] Link de redefinição:{' '}
              <a href={devLink} style={{ color: 'orange', wordBreak: 'break-all' }}>{devLink}</a>
            </p>
          )}
          <Link to="/login" style={{ color: 'orange' }}>Voltar ao login</Link>
        </>
      ) : (
        <>
          <p style={{ marginBottom: '15px', color: '#aaa' }}>
            Digite o e-mail da sua conta e enviaremos um link para criar uma nova senha.
          </p>
          <div style={{ marginBottom: '15px' }}>
            <label>E-mail:</label><br />
            <input type="email" value={email}
              onChange={e => setEmail(e.target.value)} style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && enviar()} />
          </div>
          <button onClick={enviar} disabled={enviando} style={{ marginBottom: '15px' }}>
            {enviando ? 'Enviando...' : 'Enviar link'}
          </button>
          <p><Link to="/login" style={{ color: 'orange' }}>Voltar ao login</Link></p>
        </>
      )}
    </div>
  )
}

export default EsqueciSenha
