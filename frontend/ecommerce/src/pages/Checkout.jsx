// src/pages/Checkout.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCarrinho } from '../context/CarrinhoContext'
import { pedidoService } from '../services/apiService'

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
]

function Checkout() {
  const navigate = useNavigate()
  const { itens, totalPreco, limparCarrinho } = useCarrinho()

  const [endereco, setEndereco] = useState({
    cep: '', rua: '', numero: '', cidade: '', estado: 'PE', complemento: ''
  })
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  const inputStyle = {
    padding: '10px', width: '300px', marginTop: '5px',
    background: '#222', color: 'white', border: '1px solid white'
  }

  function atualizarCampo(campo, valor) {
    setEndereco(prev => ({ ...prev, [campo]: valor }))
  }

  async function finalizarPedido() {
    const obrigatorios = ['cep', 'rua', 'numero', 'cidade', 'estado']
    if (obrigatorios.some(campo => !endereco[campo].trim())) {
      setErro('Preencha todos os campos do endereço!')
      return
    }
    if (itens.length === 0) {
      setErro('Seu carrinho está vazio.')
      return
    }

    setErro(null)
    setEnviando(true)
    try {
      const pedido = await pedidoService.criar(itens, endereco)
      limparCarrinho()
      alert(`Pedido #${pedido.id} realizado com sucesso! Total: R$ ${pedido.valorTotal.toFixed(2)}`)
      navigate('/produtos')
    } catch (err) {
      setErro(err.message || 'Erro ao finalizar pedido.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px' }}>Finalizar Pedido</h2>

      <div style={{ marginBottom: '20px', color: 'orange' }}>
        {itens.length} {itens.length === 1 ? 'item' : 'itens'} —{' '}
        Total: R$ {totalPreco.toFixed(2)}
      </div>

      {erro && <p style={{ color: 'red', marginBottom: '15px' }}>{erro}</p>}

      <div style={{ marginBottom: '15px' }}>
        <label>CEP:</label><br />
        <input type="text" value={endereco.cep} placeholder="00000-000"
          onChange={e => atualizarCampo('cep', e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Rua:</label><br />
        <input type="text" value={endereco.rua}
          onChange={e => atualizarCampo('rua', e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Número:</label><br />
        <input type="text" value={endereco.numero}
          onChange={e => atualizarCampo('numero', e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Complemento (opcional):</label><br />
        <input type="text" value={endereco.complemento}
          onChange={e => atualizarCampo('complemento', e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Cidade:</label><br />
        <input type="text" value={endereco.cidade}
          onChange={e => atualizarCampo('cidade', e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Estado (UF):</label><br />
        <select value={endereco.estado}
          onChange={e => atualizarCampo('estado', e.target.value)} style={inputStyle}>
          {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
        </select>
      </div>

      <button onClick={finalizarPedido} disabled={enviando}>
        {enviando ? 'Enviando...' : 'Confirmar Pedido'}
      </button>
    </div>
  )
}

export default Checkout
