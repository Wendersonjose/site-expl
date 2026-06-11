/**
 * Converte uma linha do banco (colunas em português, prefixadas) no DTO
 * que a API expõe. Centralizar a tradução aqui evita espalhar nomes de
 * coluna pelo restante do código (camada anticorrupção).
 */
export function toProductDTO(row) {
  if (!row) {
    return null;
  }

  const imagens = Array.isArray(row.imagens)
    ? row.imagens.map((img) => ({ url: img.url, principal: Boolean(img.principal) }))
    : [];

  return {
    id: row.id_produto,
    nome: row.nome,
    descricao: row.descricao,
    precoVenda: Number(row.preco_venda),
    custoUnitario: Number(row.custo_unitario),
    estoque: row.estoque_atual,
    ativo: Boolean(row.ativo),
    categoria: row.id_categoria
      ? { id: row.id_categoria, nome: row.nome_categoria ?? null }
      : null,
    imagens,
    imagem: row.imagem_principal ?? imagens.find((i) => i.principal)?.url ?? imagens[0]?.url ?? null,
  };
}
