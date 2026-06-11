/**
 * Converte a linha do banco no DTO público de usuário.
 * IMPORTANTE: nunca inclui o campo `senha` — o hash não deve sair da API.
 */
export function toUserDTO(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id_usuario,
    nome: row.nome,
    email: row.email,
    perfil: row.perfil,
    dataCriacao: row.data_criacao,
  };
}
