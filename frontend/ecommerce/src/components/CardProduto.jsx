// src/components/CardProduto.jsx

import { Link } from 'react-router-dom'
import { useCarrinho } from '../context/CarrinhoContext'

const IMAGEM_PADRAO = 'https://placehold.co/250x200?text=Expl%F0%9F%92%A5'

function CardProduto({ produto }) {
  const { adicionarItem } = useCarrinho()
  const preco = Number(produto.precoVenda ?? 0)

  function handleAdicionar() {
    adicionarItem(produto, 1)
    alert(`"${produto.nome}" adicionado ao carrinho!`)
  }

  return (
    <div className="card-produto">
      <img src={produto.imagem || IMAGEM_PADRAO} alt={produto.nome} />
      <h3>{produto.nome}</h3>
      <p>R$ {preco.toFixed(2)}</p>
      <Link to={`/produto/${produto.id}`}>Ver detalhes</Link>
      <button onClick={handleAdicionar} style={{ marginTop: '8px' }}>
        + Carrinho
      </button>
    </div>
  )
}

export default CardProduto
