// src/pages/Produtos.jsx

import { useState, useEffect } from 'react'
import CardProduto from '../components/CardProduto'
import { produtoService } from '../services/apiService'

function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    produtoService.listar()
      .then(lista => setProdutos(lista.filter(p => p.ativo)))
      .catch(err => setErro(err.message || 'Erro ao carregar produtos.'))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) {
    return <div className="container"><p>Carregando produtos...</p></div>
  }

  if (erro) {
    return <div className="container"><p style={{ color: 'red' }}>{erro}</p></div>
  }

  if (produtos.length === 0) {
    return <div className="container"><p>Nenhum produto disponível no momento.</p></div>
  }

  return (
    <div>
      <h2 style={{ padding: '30px' }}>Nossos Produtos</h2>
      <div className="grid-produtos">
        {produtos.map(p => (
          <CardProduto key={p.id} produto={p} />
        ))}
      </div>
    </div>
  )
}

export default Produtos
