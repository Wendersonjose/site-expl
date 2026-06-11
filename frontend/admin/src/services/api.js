// src/services/api.js
//
// Camada única de acesso à API do backend (backend/ecommerce).
// Respostas seguem { success, data } — os helpers retornam só `data`.
// Exportações de relatório (CSV/PDF) retornam um Blob.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getToken() {
  return localStorage.getItem('admin_token')
}

function authHeaders(extra = {}) {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

async function handle(res) {
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const details = Array.isArray(body.details) ? ` ${body.details.join('. ')}` : ''
    throw new Error((body.message || `Erro ${res.status}`) + details)
  }
  return body.data
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: authHeaders(options.headers),
  })
  return handle(res)
}

export const authApi = {
  login: (email, senha) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }),
}

export const productsApi = {
  listar: () => request('/products'),
  buscar: (id) => request(`/products/${id}`),
  criar: (dados) => request('/products', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) =>
    request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluir: (id) => request(`/products/${id}`, { method: 'DELETE' }),
}

export const categoriesApi = {
  listar: () => request('/categories'),
  criar: (nomeCategoria) =>
    request('/categories', { method: 'POST', body: JSON.stringify({ nomeCategoria }) }),
  excluir: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
}

export const usersApi = {
  listar: () => request('/users'),
  criar: (dados) => request('/users', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) =>
    request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluir: (id) => request(`/users/${id}`, { method: 'DELETE' }),
}

export const reportsApi = {
  dashboard: () => request('/reports/dashboard'),

  // Baixa um arquivo (csv|pdf) de um relatório e dispara o download no navegador.
  async exportar(relatorio, formato) {
    const res = await fetch(`${API_URL}/reports/${relatorio}/export/${formato}`, {
      headers: authHeaders(),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.message || `Erro ${res.status}`)
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${relatorio}.${formato}`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  },
}
