// src/pages/Produtos.jsx

import { useEffect, useState } from 'react'
import { productsApi, categoriesApi } from '../services/api'
import Modal from '../components/Modal'

const FORM_VAZIO = {
  nome: '', descricao: '', precoVenda: '', custoUnitario: '',
  estoque: '', idCategoria: '', imagem: '', ativo: true,
}

function moeda(v) {
  return Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null) // id ou null
  const [form, setForm] = useState(FORM_VAZIO)
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState(null)

  async function carregar() {
    setCarregando(true)
    try {
      const [prods, cats] = await Promise.all([productsApi.listar(), categoriesApi.listar()])
      setProdutos(prods)
      setCategorias(cats)
      setErro(null)
    } catch (err) {
      setErro(err.message || 'Erro ao carregar dados.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregar() }, [])

  function abrirCriar() {
    setEditando(null)
    setForm({ ...FORM_VAZIO, idCategoria: categorias[0]?.id ?? '' })
    setErroForm(null)
    setModalAberto(true)
  }

  function abrirEditar(p) {
    setEditando(p.id)
    setForm({
      nome: p.nome,
      descricao: p.descricao ?? '',
      precoVenda: p.precoVenda,
      custoUnitario: p.custoUnitario,
      estoque: p.estoque,
      idCategoria: p.categoria?.id ?? '',
      imagem: p.imagem ?? '',
      ativo: p.ativo,
    })
    setErroForm(null)
    setModalAberto(true)
  }

  function atualizarCampo(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }))
  }

  async function salvar(e) {
    e.preventDefault()
    setErroForm(null)
    setSalvando(true)
    try {
      const payload = {
        nome: form.nome,
        descricao: form.descricao || null,
        precoVenda: Number(form.precoVenda),
        custoUnitario: Number(form.custoUnitario),
        estoque: Number(form.estoque),
        idCategoria: Number(form.idCategoria),
        ativo: form.ativo,
        imagens: form.imagem ? [{ url: form.imagem, principal: true }] : [],
      }
      if (editando) {
        await productsApi.atualizar(editando, payload)
      } else {
        await productsApi.criar(payload)
      }
      setModalAberto(false)
      await carregar()
    } catch (err) {
      setErroForm(err.message || 'Erro ao salvar produto.')
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(p) {
    if (!confirm(`Excluir o produto "${p.nome}"?`)) return
    try {
      await productsApi.excluir(p.id)
      await carregar()
    } catch (err) {
      alert(err.message || 'Erro ao excluir.')
    }
  }

  if (carregando) return <div className="conteudo"><p>Carregando produtos...</p></div>

  return (
    <div className="conteudo">
      <div className="painel-cabecalho">
        <div>
          <h1>Produtos</h1>
          <p className="subtitulo">{produtos.length} produto(s) cadastrado(s)</p>
        </div>
        <button onClick={abrirCriar} disabled={categorias.length === 0}>+ Novo produto</button>
      </div>

      {erro && <div className="aviso erro">{erro}</div>}
      {categorias.length === 0 && !erro && (
        <div className="aviso erro">Cadastre uma categoria antes de criar produtos.</div>
      )}

      <div className="painel">
        {produtos.length === 0 ? (
          <p className="vazio">Nenhum produto cadastrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(p => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{p.categoria?.nome ?? '—'}</td>
                  <td>{moeda(p.precoVenda)}</td>
                  <td style={{ color: p.estoque <= 5 ? 'var(--danger)' : 'inherit' }}>{p.estoque}</td>
                  <td>
                    <span className={`badge ${p.ativo ? 'ok' : 'off'}`}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="acoes">
                      <button className="secundario" onClick={() => abrirEditar(p)}>Editar</button>
                      <button className="perigo" onClick={() => excluir(p)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalAberto && (
        <Modal titulo={editando ? 'Editar produto' : 'Novo produto'} onFechar={() => setModalAberto(false)}>
          <form onSubmit={salvar}>
            {erroForm && <div className="aviso erro">{erroForm}</div>}

            <div className="campo">
              <label>Nome</label>
              <input value={form.nome} onChange={e => atualizarCampo('nome', e.target.value)} />
            </div>

            <div className="campo">
              <label>Descrição</label>
              <input value={form.descricao} onChange={e => atualizarCampo('descricao', e.target.value)} />
            </div>

            <div className="grid-2">
              <div className="campo">
                <label>Preço de venda (R$)</label>
                <input type="number" step="0.01" min="0" value={form.precoVenda}
                  onChange={e => atualizarCampo('precoVenda', e.target.value)} />
              </div>
              <div className="campo">
                <label>Custo unitário (R$)</label>
                <input type="number" step="0.01" min="0" value={form.custoUnitario}
                  onChange={e => atualizarCampo('custoUnitario', e.target.value)} />
              </div>
            </div>

            <div className="grid-2">
              <div className="campo">
                <label>Estoque</label>
                <input type="number" min="0" value={form.estoque}
                  onChange={e => atualizarCampo('estoque', e.target.value)} />
              </div>
              <div className="campo">
                <label>Categoria</label>
                <select value={form.idCategoria} onChange={e => atualizarCampo('idCategoria', e.target.value)}>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nomeCategoria}</option>)}
                </select>
              </div>
            </div>

            <div className="campo">
              <label>URL da imagem</label>
              <input value={form.imagem} onChange={e => atualizarCampo('imagem', e.target.value)}
                placeholder="https://..." />
            </div>

            <div className="campo">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 'auto' }} checked={form.ativo}
                  onChange={e => atualizarCampo('ativo', e.target.checked)} />
                Produto ativo (visível na loja)
              </label>
            </div>

            <div className="acoes" style={{ justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" className="secundario" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Produtos
