import { prisma } from "../../database/prisma.js";

interface CriarProdutoData {
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl?: string;
  categoriaId: string;
}


//cria produtos no banco

export async function criarProduto(data: CriarProdutoData) {
  const categoria = await prisma.categoria.findUnique({
    where: {
      id: data.categoriaId,
    },
  });

  if (!categoria) {
    return null;
  }

  const produto = await prisma.produto.create({
    data: {
      nome: data.nome,
      descricao: data.descricao,
      preco: data.preco,
      imagemUrl: data.imagemUrl,
      categoriaId: data.categoriaId,
    },
  });

  return produto;
  


}


//lista produtos no  banco em ordem asc

export async function listarProdutos() {
  const produtos = await prisma.produto.findMany({
    orderBy: {
      nome: "asc",
    },
  });

  return produtos;
}