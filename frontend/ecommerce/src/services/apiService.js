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
