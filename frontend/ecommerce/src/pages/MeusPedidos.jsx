// src/pages/MeusPedidos.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pedidoService, pagamentoService, avaliacaoService } from '../services/apiService'

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

// Formulário de avaliação inline para um item de um pedido pago.
function FormAvaliacao({ idPedido, item, onAvaliado }) {
  const [aberto, setAberto] = useState(false)
  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)
  const [feito, setFeito] = useState(false)

  async function enviar() {
    setEnviando(true)
    setErro(null)
    try {
      await avaliacaoService.avaliar(item.idProduto, idPedido, nota, comentario)
      setFeito(true)
      setAberto(false)
      onAvaliado?.()
    } catch (err) {
      setErro(err.message || 'Erro ao avaliar.')
    } finally {
      setEnviando(false)
    }
  }

  if (feito) return <span style={{ color: '#28a745', fontSize: '13px' }}>✓ Avaliado</span>
  if (!aberto) {
    return (
      <button onClick={() => setAberto(true)}
        style={{ background: '#333', padding: '4px 12px', fontSize: '13px' }}>
        Avaliar
      </button>
    )
  }

  return (
    <div style={{ marginTop: '8px', textAlign: 'left' }}>
      {erro && <p style={{ color: 'red', fontSize: '13px', marginBottom: '6px' }}>{erro}</p>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px' }}>Nota:</span>
        <select value={nota} onChange={e => setNota(Number(e.target.value))}
          style={{ padding: '4px', background: '#222', color: 'white', border: '1px solid #555' }}>
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
        </select>
      </div>
      <textarea value={comentario} onChange={e => setComentario(e.target.value)}
        placeholder="Comentário (opcional)" rows={2}
        style={{ width: '100%', maxWidth: '320px', padding: '6px', background: '#222', color: 'white', border: '1px solid #555' }} />
      <div style={{ marginTop: '6px', display: 'flex', gap: '8px' }}>
        <button onClick={enviar} disabled={enviando} style={{ padding: '4px 12px', fontSize: '13px' }}>
          {enviando ? 'Enviando...' : 'Enviar avaliação'}
        </button>
        <button onClick={() => setAberto(false)} style={{ background: '#555', padding: '4px 12px', fontSize: '13px' }}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

function MeusPedidos() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])
  const [formas, setFormas] = useState([])
  const [formaPorPedido, setFormaPorPedido] = useState({})
  const [pagandoId, setPagandoId] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  async function carregar() {
    try {
      const [lista, formasPag] = await Promise.all([
        pedidoService.listar(),
        pagamentoService.formas(),
      ])
      setPedidos(lista)
      setFormas(formasPag)
    } catch (err) {
      setErro(err.message || 'Erro ao carregar pedidos.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregar() }, [])

  async function pagar(idPedido) {
    const idForma = formaPorPedido[idPedido] ?? formas[0]?.id
    if (!idForma) return
    setPagandoId(idPedido)
    setErro(null)
    try {
      await pagamentoService.pagar(idPedido, idForma)
      await carregar()
    } catch (err) {
      setErro(err.message || 'Erro ao pagar pedido.')
    } finally {
      setPagandoId(null)
    }
  }

  if (carregando) return <div className="container"><p>Carregando seus pedidos...</p></div>

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
      {erro && <p style={{ color: 'red', marginBottom: '15px' }}>{erro}</p>}

      {pedidos.map(pedido => {
        const status = STATUS_LABEL[pedido.status] ?? { texto: pedido.status, cor: '#aaa' }
        const pendente = pedido.status === 'pendente'
        return (
          <div key={pedido.id} style={{
            background: '#1a1a1a', border: '1px solid #333',
            borderRadius: '8px', padding: '20px', marginBottom: '16px', textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              <strong>Pedido #{pedido.id}</strong>
              <span style={{ color: status.cor, border: `1px solid ${status.cor}`, borderRadius: '4px', padding: '2px 10px', fontSize: '13px' }}>
                {status.texto}
              </span>
            </div>

            <p style={{ color: '#888', fontSize: '13px', marginBottom: '12px' }}>{formatarData(pedido.dataPedido)}</p>

            <table>
              <thead>
                <tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Subtotal</th>{!pendente && <th>Avaliar</th>}</tr>
              </thead>
              <tbody>
                {pedido.itens.map(item => (
                  <tr key={item.idProduto}>
                    <td>{item.nome}</td>
                    <td>{item.quantidade}</td>
                    <td>R$ {item.precoUnitario.toFixed(2)}</td>
                    <td>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</td>
                    {!pendente && (
                      <td><FormAvaliacao idPedido={pedido.id} item={item} /></td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ color: 'orange', textAlign: 'right', marginTop: '12px' }}>
              Total: R$ {pedido.valorTotal.toFixed(2)}
            </h3>

            {pendente && (
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <select
                  value={formaPorPedido[pedido.id] ?? formas[0]?.id ?? ''}
                  onChange={e => setFormaPorPedido(p => ({ ...p, [pedido.id]: Number(e.target.value) }))}
                  style={{ padding: '8px', background: '#222', color: 'white', border: '1px solid #555' }}
                >
                  {formas.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </select>
                <button onClick={() => pagar(pedido.id)} disabled={pagandoId === pedido.id}>
                  {pagandoId === pedido.id ? 'Processando...' : 'Pagar pedido'}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default MeusPedidos
