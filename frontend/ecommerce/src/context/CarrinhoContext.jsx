// src/context/CarrinhoContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'

const CarrinhoContext = createContext(null)

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState(() => {
    try {
      const salvo = localStorage.getItem('carrinho')
      return salvo ? JSON.parse(salvo) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens))
  }, [itens])

  function adicionarItem(produto, quantidade = 1) {
    setItens(prev => {
      const existe = prev.find(i => i.id === produto.id)
      if (existe) {
        return prev.map(i =>
          i.id === produto.id
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i
        )
      }
      return [...prev, { ...produto, quantidade }]
    })
  }

  function removerItem(id) {
    setItens(prev => prev.filter(i => i.id !== id))
  }

  function atualizarQuantidade(id, quantidade) {
    if (quantidade <= 0) { removerItem(id); return }
    setItens(prev => prev.map(i => i.id === id ? { ...i, quantidade } : i))
  }

  function limparCarrinho() {
    setItens([])
  }

  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0)
  const totalPreco = itens.reduce((acc, i) => {
    const preco = Number(i.precoVenda ?? 0)
    return acc + preco * i.quantidade
  }, 0)

  return (
    <CarrinhoContext.Provider value={{
      itens, adicionarItem, removerItem,
      atualizarQuantidade, limparCarrinho,
      totalItens, totalPreco
    }}>
      {children}
    </CarrinhoContext.Provider>
  )
}

export function useCarrinho() {
  return useContext(CarrinhoContext)
}