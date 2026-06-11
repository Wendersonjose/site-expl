// src/pages/MeusPedidos.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pedidoService } from '../services/apiService'

const STATUS_LABEL = {
  pendente: { texto: 'Pendente', cor: '#e0a800' },
  pago: { texto: 'Pago', cor: '#28a745' },
  enviado: { texto: 'Enviado', cor: '#17a2b8' },
  entregue: { texto: 'Entregue', cor: '#28a745' },
  cancelado: { texto: 'Cancelado', cor: '#c00' },
}

function formatarData(valor) {
  if (!valor) return ''
  const data = new Date(valor.replace(' ', 'T'))
  return Number.isNaN(data.getTime()) ? valor : data.toLocaleString('pt-BR')
}

function MeusPedidos() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    pedidoService.listar()
      .then(setPedidos)
      .catch(err => setErro(err.message || 'Erro ao carregar pedidos.'))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) {
    return <div className="container"><p>Carregando seus pedidos...</p></div>
  }

  if (erro) {
    return <div className="container"><p style={{ color: 'red' }}>{erro}</p></div>
  }

  if (pedidos.length === 0) {
    return (
      <div className="container">
        <h2 style={{ marginBottom: '20px' }}>Meus Pedidos</h2>
        <p style={{ marginBottom: '20px' }}>Você ainda não fez nenhum pedido.</p>
        <button onClick={() => navigate('/produtos')}>Ver Produtos</button>
      </div>
    )
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px' }}>Meus Pedidos</h2>

      {pedidos.map(pedido => {
        const status = STATUS_LABEL[pedido.status] ?? { texto: pedido.status, cor: '#aaa' }
        return (
          <div key={pedido.id} style={{
            background: '#1a1a1a', border: '1px solid #333',
            borderRadius: '8px', padding: '20px', marginBottom: '16px', textAlign: 'left'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '8px', marginBottom: '12px'
            }}>
              <strong>Pedido #{pedido.id}</strong>
              <span style={{
                color: status.cor, border: `1px solid ${status.cor}`,
                borderRadius: '4px', padding: '2px 10px', fontSize: '13px'
              }}>
                {status.texto}
              </span>
            </div>

            <p style={{ color: '#888', fontSize: '13px', marginBottom: '12px' }}>
              {formatarData(pedido.dataPedido)}
            </p>

            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Qtd</th>
                  <th>Preço</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedido.itens.map(item => (
                  <tr key={item.idProduto}>
                    <td>{item.nome}</td>
                    <td>{item.quantidade}</td>
                    <td>R$ {item.precoUnitario.toFixed(2)}</td>
                    <td>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: '12px', textAlign: 'right' }}>
              Entrega: {pedido.endereco.rua}, {pedido.endereco.numero} —{' '}
              {pedido.endereco.cidade}/{pedido.endereco.estado}
            </p>
            <h3 style={{ color: 'orange', textAlign: 'right', marginTop: '8px' }}>
              Total: R$ {pedido.valorTotal.toFixed(2)}
            </h3>
          </div>
        )
      })}
    </div>
  )
}

export default MeusPedidos
