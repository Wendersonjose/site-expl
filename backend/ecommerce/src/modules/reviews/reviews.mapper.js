/**
 * Converte uma linha de `avaliacoes` (com o nome do usuário via JOIN) no
 * DTO público de avaliação.
 */
export function toReviewDTO(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id_avaliacao,
    idProduto: row.id_produto,
    idPedido: row.id_pedido,
    usuario: { id: row.id_usuario, nome: row.nome ?? null },
    nota: row.nota,
    comentario: row.comentario,
    dataAvaliacao: row.data_avaliacao,
  };
}
