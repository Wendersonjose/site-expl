// src/pages/Produto.jsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCarrinho } from '../context/CarrinhoContext'
import { produtoService } from '../services/apiService'

const IMAGEM_PADRAO = 'https://placehold.co/400x300?text=Expl%F0%9F%92%A5'

function Produto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { adicionarItem } = useCarrinho()

  const [produto, setProduto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)

  useEffect(() => {
    setCarregando(true)
    produtoService.buscarPorId(id)
      .then(setProduto)
      .catch(() => setProduto(null))
      .finally(() => setCarregando(false))
  }, [id])

  function handleAdicionar() {
    adicionarItem(produto, quantidade)
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 2000)
  }

  if (carregando) return <div className="container"><p>Carregando...</p></div>
  if (!produto) return <div className="container"><h2>Produto não encontrado</h2></div>

  const semEstoque = produto.estoque <= 0

  return (
    <div className="container">
      <img
        src={produto.imagem || IMAGEM_PADRAO}
        alt={produto.nome}
        style={{ width: '400px', maxWidth: '100%' }}
      />
      <h2 style={{ marginTop: '20px' }}>{produto.nome}</h2>
      <p style={{ color: 'orange', fontSize: '24px', margin: '10px 0' }}>
        R$ {Number(produto.precoVenda).toFixed(2)}
      </p>
      {produto.descricao && <p style={{ margin: '10px 0' }}>{produto.descricao}</p>}
      <p style={{ color: semEstoque ? 'red' : '#aaa', fontSize: '14px' }}>
        {semEstoque ? 'Sem estoque' : `${produto.estoque} em estoque`}
      </p>

      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '12px', margin: '20px 0'
      }}>
        <button
          onClick={() => setQuantidade(q => Math.max(1, q - 1))}
          style={{ padding: '8px 16px' }}
        >−</button>
        <span style={{ fontSize: '20px' }}>{quantidade}</span>
        <button
          onClick={() => setQuantidade(q => Math.min(produto.estoque, q + 1))}
          style={{ padding: '8px 16px' }}
        >+</button>
      </div>

      <button onClick={handleAdicionar} disabled={semEstoque} style={{ marginRight: '12px' }}>
        {adicionado ? '✓ Adicionado!' : 'Adicionar ao Carrinho'}
      </button>
      <button onClick={() => navigate('/carrinho')} style={{ background: '#333' }}>
        Ver Carrinho
      </button>
    </div>
  )
}

export default Produto
