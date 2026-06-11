// src/services/apiService.js
//
// Camada única de comunicação com a API do backend (backend/ecommerce).
// Todas as respostas da API seguem o formato { success, data } — os
// services abaixo já devolvem só o `data`, pronto para uso nas páginas.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

async function handleResponse(res) {
  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    // A API manda { message, details? } — junta tudo numa mensagem legível.
    const details = Array.isArray(body.details) ? ` ${body.details.join('. ')}` : ''
    throw new Error((body.message || `Erro ${res.status}`) + details)
  }

  return body.data
}

export const authService = {
  // POST /auth/login -> { user, token }
  async login(email, senha) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    })
    return handleResponse(res)
  },

  // POST /auth/register -> { user, token } (cadastro público de cliente)
  async cadastrar(nome, email, senha) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    })
    return handleResponse(res)
  },

  // POST /auth/forgot-password -> { devResetUrl? } (em dev, devolve o link)
  async esqueciSenha(email) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    return handleResponse(res)
  },

  // POST /auth/reset-password -> null (redefine a senha pelo token do link)
  async redefinirSenha(token, novaSenha) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, novaSenha })
    })
    return handleResponse(res)
  }
}

export const produtoService = {
  // GET /products -> [{ id, nome, precoVenda, estoque, categoria, imagem, ... }]
  async listar() {
    const res = await fetch(`${API_URL}/products`)
    return handleResponse(res)
  },

  // GET /products/:id
  async buscarPorId(id) {
    const res = await fetch(`${API_URL}/products/${id}`)
    return handleResponse(res)
  }
}

export const pedidoService = {
  // POST /orders -> pedido criado (requer login)
  // endereco: { cep, rua, numero, cidade, estado, complemento? }
  // itens do carrinho: [{ id, quantidade, ... }]
  async criar(itens, endereco) {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        endereco,
        itens: itens.map(item => ({
          idProduto: item.id,
          quantidade: item.quantidade
        }))
      })
    })
    return handleResponse(res)
  },

  // GET /orders -> pedidos do usuário logado
  async listar() {
    const res = await fetch(`${API_URL}/orders`, { headers: getHeaders() })
    return handleResponse(res)
  }
}

export const pagamentoService = {
  // GET /payments/methods -> [{ id, nome, ativo }]
  async formas() {
    const res = await fetch(`${API_URL}/payments/methods`)
    return handleResponse(res)
  },

  // POST /payments -> transação confirmada (marca o pedido como pago)
  async pagar(idPedido, idForma) {
    const res = await fetch(`${API_URL}/payments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ idPedido, idForma })
    })
    return handleResponse(res)
  }
}

export const avaliacaoService = {
  // GET /reviews/product/:id -> { media, total, avaliacoes: [...] }
  async doProduto(idProduto) {
    const res = await fetch(`${API_URL}/reviews/product/${idProduto}`)
    return handleResponse(res)
  },

  // POST /reviews -> avaliação criada (requer login e ter comprado o produto)
  async avaliar(idProduto, idPedido, nota, comentario) {
    const res = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ idProduto, idPedido, nota, comentario })
    })
    return handleResponse(res)
  }
}
