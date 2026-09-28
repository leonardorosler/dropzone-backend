import { prisma } from "../../database/prisma.js";

interface CriarProdutoData {
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl?: string;
  categoriaId: number;
  destaque?: boolean;
}

interface AtualizarProdutoData {
  nome: string;
  descricao: string;
  preco: number;
  categoriaId: number;
  destaque?: boolean;
}

interface ListarProdutosFiltros {
  destaque?: boolean;
}

const produtoInclude = {
  categoria: true,
  imagens: true,
  variacoes: {
    include: {
      cor: true,
      tamanho: true,
    },
  },
};

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
      categoriaId: data.categoriaId,
      destaque: data.destaque ?? false,
      imagens: data.imagemUrl
        ? {
            create: {
              imagemUrl: data.imagemUrl,
            },
          }
        : undefined,
    },
    include: produtoInclude,
  });

  return produto;
}

export async function listarProdutos(filtros: ListarProdutosFiltros = {}) {
  const produtos = await prisma.produto.findMany({
    where: {
      destaque: filtros.destaque,
    },
    orderBy: {
      nome: "asc",
    },
    include: produtoInclude,
  });

  return produtos;
}

export async function buscarProdutoPorId(id: number) {
  const produto = await prisma.produto.findUnique({
    where: {
      id,
    },
    include: produtoInclude,
  });

  return produto;
}

export async function atualizarProduto(
  id: number,
  data: AtualizarProdutoData
) {
  const produto = await prisma.produto.update({
    where: {
      id,
    },
    data: {
      nome: data.nome,
      descricao: data.descricao,
      preco: data.preco,
      categoriaId: data.categoriaId,
      destaque: data.destaque,
    },
    include: produtoInclude,
  });

  return produto;
}

export async function atualizarDisponibilidadeProduto(
  id: number,
  disponivel: boolean
) {
  const produto = await prisma.produto.update({
    where: {
      id,
    },
    data: {
      disponivel,
    },
    include: produtoInclude,
  });

  return produto;
}

export async function deletarProduto(id: number) {
  const produto = await prisma.produto.delete({
    where: {
      id,
    },
  });

  return produto;
}