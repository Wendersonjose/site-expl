/**
 * Converte linhas das tabelas pedidos/itens_pedido no DTO público.
 */
export function toOrderDTO(orderRow, itemRows = []) {
  if (!orderRow) {
    return null;
  }

  return {
    id: orderRow.id_pedido,
    status: orderRow.status,
    dataPedido: orderRow.data_pedido,
    subtotal: Number(orderRow.subtotal),
    desconto: Number(orderRow.desconto),
    frete: Number(orderRow.frete),
    valorTotal: Number(orderRow.valor_total),
    endereco: {
      id: orderRow.id_endereco,
      cep: orderRow.cep,
      rua: orderRow.rua,
      numero: orderRow.numero,
      cidade: orderRow.cidade,
      estado: orderRow.estado,
      complemento: orderRow.complemento,
    },
    itens: itemRows.map((item) => ({
      idProduto: item.id_produto,
      nome: item.nome,
      quantidade: item.quantidade,
      precoUnitario: Number(item.preco_unitario),
      descontoAplicado: Number(item.desconto_aplicado),
    })),
  };
}
