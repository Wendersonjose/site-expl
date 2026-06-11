// src/pages/Carrinho.jsx

import { useNavigate } from 'react-router-dom'
import { useCarrinho } from '../context/CarrinhoContext'

function Carrinho() {
  const navigate = useNavigate()
  const { itens, removerItem, atualizarQuantidade, totalPreco } = useCarrinho()

  if (itens.length === 0) {
    return (
      <div className="container">
        <h2 style={{ marginBottom: '20px' }}>Meu Carrinho</h2>
        <p style={{ marginBottom: '20px' }}>Seu carrinho está vazio.</p>
        <button onClick={() => navigate('/produtos')}>Ver Produtos</button>
      </div>
    )
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px' }}>Meu Carrinho</h2>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Subtotal</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {itens.map(item => {
            const preco = Number(item.precoVenda ?? 0)
            const nome = item.nome
            return (
              <tr key={item.id}>
                <td>{nome}</td>
                <td>R$ {preco.toFixed(2)}</td>
                <td>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '8px', justifyContent: 'center'
                  }}>
                    <button
                      onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                      style={{ padding: '4px 10px', fontSize: '14px' }}
                    >−</button>
                    <span>{item.quantidade}</span>
                    <button
                      onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                      style={{ padding: '4px 10px', fontSize: '14px' }}
                    >+</button>
                  </div>
                </td>
                <td>R$ {(preco * item.quantidade).toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => removerItem(item.id)}
                    style={{ background: '#c00', padding: '6px 12px', fontSize: '13px' }}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <h3 style={{ margin: '20px 0', color: 'orange' }}>
        Total: R$ {totalPreco.toFixed(2)}
      </h3>
      <button onClick={() => navigate('/checkout')}>Finalizar Compra</button>
    </div>
  )
}

export default Carrinho