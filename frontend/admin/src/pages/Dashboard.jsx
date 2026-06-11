// src/pages/Dashboard.jsx

import { useEffect, useState } from 'react'
import { reportsApi } from '../services/api'

function moeda(valor) {
  return Number(valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function BotoesExport({ relatorio }) {
  const [baixando, setBaixando] = useState(null)

  async function baixar(formato) {
    setBaixando(formato)
    try {
      await reportsApi.exportar(relatorio, formato)
    } catch (err) {
      alert(err.message || 'Erro ao exportar.')
    } finally {
      setBaixando(null)
    }
  }

  return (
    <div className="acoes">
      <button className="secundario" disabled={baixando} onClick={() => baixar('csv')}>
        {baixando === 'csv' ? '...' : 'CSV'}
      </button>
      <button className="secundario" disabled={baixando} onClick={() => baixar('pdf')}>
        {baixando === 'pdf' ? '...' : 'PDF'}
      </button>
    </div>
  )
}

function Dashboard() {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    reportsApi.dashboard()
      .then(setDados)
      .catch(err => setErro(err.message || 'Erro ao carregar relatórios.'))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return <div className="conteudo"><p>Carregando relatórios...</p></div>
  if (erro) return <div className="conteudo"><div className="aviso erro">{erro}</div></div>

  const faturamento = dados.faturamento_total ?? {}
  const ticket = dados.ticket_medio ?? {}
  const maisVendidos = dados.produtos_mais_vendidos ?? []
  const estoqueBaixo = dados.estoque_baixo ?? []

  return (
    <div className="conteudo">
      <h1>Dashboard</h1>
      <p className="subtitulo">Visão geral da loja</p>

      <div className="cards">
        <div className="card">
          <div className="rotulo">Faturamento total</div>
          <div className="valor accent">{moeda(faturamento.faturamento_total)}</div>
        </div>
        <div className="card">
          <div className="rotulo">Transações</div>
          <div className="valor">{faturamento.total_transacoes ?? 0}</div>
        </div>
        <div className="card">
          <div className="rotulo">Ticket médio</div>
          <div className="valor accent">{moeda(ticket.ticket_medio)}</div>
        </div>
        <div className="card">
          <div className="rotulo">Pedidos</div>
          <div className="valor">{ticket.total_pedidos ?? 0}</div>
        </div>
      </div>

      <div className="painel">
        <div className="painel-cabecalho">
          <h2>Produtos mais vendidos</h2>
          <BotoesExport relatorio="produtos-mais-vendidos" />
        </div>
        {maisVendidos.length === 0 ? (
          <p className="vazio">Nenhuma venda registrada ainda.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Produto</th><th>Unidades</th><th>Pedidos</th><th>Estoque</th></tr>
            </thead>
            <tbody>
              {maisVendidos.map(p => (
                <tr key={p.id_produto}>
                  <td>{p.nome}</td>
                  <td>{p.total_unidades_vendidas}</td>
                  <td>{p.total_pedidos}</td>
                  <td>{p.estoque_atual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="painel">
        <div className="painel-cabecalho">
          <h2>Estoque baixo</h2>
          <BotoesExport relatorio="estoque-baixo" />
        </div>
        {estoqueBaixo.length === 0 ? (
          <p className="vazio">Nenhum produto com estoque baixo.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Produto</th><th>Estoque</th><th>Preço</th></tr>
            </thead>
            <tbody>
              {estoqueBaixo.map(p => (
                <tr key={p.id_produto}>
                  <td>{p.nome}</td>
                  <td style={{ color: p.estoque_atual <= 5 ? 'var(--danger)' : 'inherit' }}>
                    {p.estoque_atual}
                  </td>
                  <td>{moeda(p.preco_venda)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Dashboard
