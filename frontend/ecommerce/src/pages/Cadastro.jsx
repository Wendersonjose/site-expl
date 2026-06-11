// src/pages/Cadastro.jsx

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Cadastro() {
  const navigate = useNavigate()
  const { cadastrar } = useAuth()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirma, setConfirma] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  const inputStyle = {
    padding: '10px', width: '300px', marginTop: '5px',
    background: '#222', color: 'white', border: '1px solid white'
  }

  async function fazerCadastro() {
    if (!nome || !email || !senha || !confirma) {
      setErro('Preencha todos os campos!'); return
    }
    if (senha !== confirma) {
      setErro('As senhas não coincidem!'); return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.'); return
    }
    setErro(null)
    setCarregando(true)
    try {
      await cadastrar(nome, email, senha)
      navigate('/produtos')
    } catch (err) {
      setErro(err.message || 'Erro ao criar conta.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px' }}>Cadastro</h2>

      {erro && <p style={{ color: 'red', marginBottom: '15px' }}>{erro}</p>}

      <div style={{ marginBottom: '15px' }}>
        <label>Nome completo:</label><br />
        <input type="text" value={nome}
          onChange={e => setNome(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Email:</label><br />
        <input type="email" value={email}
          onChange={e => setEmail(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Senha:</label><br />
        <input type="password" value={senha}
          onChange={e => setSenha(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Confirmar senha:</label><br />
        <input type="password" value={confirma}
          onChange={e => setConfirma(e.target.value)} style={inputStyle} />
      </div>

      <button onClick={fazerCadastro} disabled={carregando} style={{ marginBottom: '15px' }}>
        {carregando ? 'Cadastrando...' : 'Cadastrar'}
      </button>

      <p style={{ marginTop: '15px' }}>
        Já tem conta?{' '}
        <Link to="/login" style={{ color: 'orange' }}>Fazer login</Link>
      </p>
    </div>
  )
}

export default Cadastro