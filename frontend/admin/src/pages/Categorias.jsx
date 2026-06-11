// src/pages/Categorias.jsx

import { useEffect, useState } from 'react'
import { categoriesApi } from '../services/api'

function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [nova, setNova] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    setCarregando(true)
    try {
      setCategorias(await categoriesApi.listar())
      setErro(null)
    } catch (err) {
      setErro(err.message || 'Erro ao carregar categorias.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregar() }, [])

  async function criar(e) {
    e.preventDefault()
    if (!nova.trim()) return
    setSalvando(true)
    try {
      await categoriesApi.criar(nova.trim())
      setNova('')
      await carregar()
    } catch (err) {
      setErro(err.message || 'Erro ao criar categoria.')
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(c) {
    if (!confirm(`Excluir a categoria "${c.nomeCategoria}"?`)) return
    try {
      await categoriesApi.excluir(c.id)
      await carregar()
    } catch (err) {
      alert(err.message || 'Erro ao excluir.')
    }
  }

  return (
    <div className="conteudo">
      <h1>Categorias</h1>
      <p className="subtitulo">Organize os produtos por categoria</p>

      {erro && <div className="aviso erro">{erro}</div>}

      <div className="painel">
        <form onSubmit={criar} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
          <input
            value={nova}
            onChange={e => setNova(e.target.value)}
            placeholder="Nome da nova categoria"
          />
          <button type="submit" disabled={salvando} style={{ whiteSpace: 'nowrap' }}>
            {salvando ? '...' : 'Adicionar'}
          </button>
        </form>
      </div>

      <div className="painel">
        {carregando ? (
          <p className="vazio">Carregando...</p>
        ) : categorias.length === 0 ? (
          <p className="vazio">Nenhuma categoria cadastrada.</p>
        ) : (
          <table>
            <thead><tr><th>Categoria</th><th></th></tr></thead>
            <tbody>
              {categorias.map(c => (
                <tr key={c.id}>
                  <td>{c.nomeCategoria}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="perigo" onClick={() => excluir(c)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Categorias
