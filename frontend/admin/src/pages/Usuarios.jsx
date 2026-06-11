// src/pages/Usuarios.jsx

import { useEffect, useState } from 'react'
import { usersApi } from '../services/api'
import Modal from '../components/Modal'

const FORM_VAZIO = { nome: '', email: '', senha: '', perfil: 'cliente' }

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState(null)

  async function carregar() {
    setCarregando(true)
    try {
      setUsuarios(await usersApi.listar())
      setErro(null)
    } catch (err) {
      setErro(err.message || 'Erro ao carregar usuários.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregar() }, [])

  function abrirCriar() {
    setEditando(null)
    setForm(FORM_VAZIO)
    setErroForm(null)
    setModalAberto(true)
  }

  function abrirEditar(u) {
    setEditando(u.id)
    setForm({ nome: u.nome, email: u.email, senha: '', perfil: u.perfil })
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
      if (editando) {
        await usersApi.atualizar(editando, {
          nome: form.nome, email: form.email, perfil: form.perfil,
        })
      } else {
        await usersApi.criar(form)
      }
      setModalAberto(false)
      await carregar()
    } catch (err) {
      setErroForm(err.message || 'Erro ao salvar usuário.')
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(u) {
    if (!confirm(`Excluir o usuário "${u.nome}"?`)) return
    try {
      await usersApi.excluir(u.id)
      await carregar()
    } catch (err) {
      alert(err.message || 'Erro ao excluir.')
    }
  }

  return (
    <div className="conteudo">
      <div className="painel-cabecalho">
        <div>
          <h1>Usuários</h1>
          <p className="subtitulo">{usuarios.length} usuário(s)</p>
        </div>
        <button onClick={abrirCriar}>+ Novo usuário</button>
      </div>

      {erro && <div className="aviso erro">{erro}</div>}

      <div className="painel">
        {carregando ? (
          <p className="vazio">Carregando...</p>
        ) : usuarios.length === 0 ? (
          <p className="vazio">Nenhum usuário.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th></th></tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.perfil === 'admin' ? 'ok' : 'off'}`}>{u.perfil}</span>
                  </td>
                  <td>
                    <div className="acoes">
                      <button className="secundario" onClick={() => abrirEditar(u)}>Editar</button>
                      <button className="perigo" onClick={() => excluir(u)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalAberto && (
        <Modal titulo={editando ? 'Editar usuário' : 'Novo usuário'} onFechar={() => setModalAberto(false)}>
          <form onSubmit={salvar}>
            {erroForm && <div className="aviso erro">{erroForm}</div>}

            <div className="campo">
              <label>Nome</label>
              <input value={form.nome} onChange={e => atualizarCampo('nome', e.target.value)} />
            </div>

            <div className="campo">
              <label>E-mail</label>
              <input type="email" value={form.email} onChange={e => atualizarCampo('email', e.target.value)} />
            </div>

            {!editando && (
              <div className="campo">
                <label>Senha</label>
                <input type="password" value={form.senha}
                  onChange={e => atualizarCampo('senha', e.target.value)} />
              </div>
            )}

            <div className="campo">
              <label>Perfil</label>
              <select value={form.perfil} onChange={e => atualizarCampo('perfil', e.target.value)}>
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
              </select>
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

export default Usuarios
