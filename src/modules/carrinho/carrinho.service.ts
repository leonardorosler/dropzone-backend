import { prisma } from "../../database/prisma.js";

interface AdicionarItemData {
  usuarioId: number;
  produtoVariacaoId: number;
  quantidade?: number;
}

interface AtualizarItemData {
  usuarioId: number;
  itemId: number;
  quantidade: number;
}

const carrinhoInclude = {
  itens: {
    include: {
      produtoVariacao: {
        include: {
          produto: {
            include: {
              imagens: true,
              categoria: true,
            },
          },
          cor: true,
          tamanho: true,
        },
      },
    },
  },
};

export async function buscarOuCriarCarrinho(usuarioId: number) {
  let carrinho = await prisma.carrinho.findFirst({
    where: {
      usuarioId,
      finalizado: false,
    },
    include: carrinhoInclude,
  });

  if (!carrinho) {
    carrinho = await prisma.carrinho.create({
      data: {
        usuarioId,
      },
      include: carrinhoInclude,
    });
  }

  return carrinho;
}

export async function listarCarrinho(usuarioId: number) {
  return buscarOuCriarCarrinho(usuarioId);
}

export async function adicionarItemCarrinho(data: AdicionarItemData) {
  const quantidade = data.quantidade ?? 1;

  if (quantidade <= 0) {
    throw new Error("Quantidade inválida");
  }

  const variacao = await prisma.produtoVariacao.findUnique({
    where: {
      id: data.produtoVariacaoId,
    },
  });

  if (!variacao) {
    throw new Error("Variação não encontrada");
  }

  if (!variacao.disponivel) {
    throw new Error("Variação indisponível");
  }

  const carrinho = await buscarOuCriarCarrinho(data.usuarioId);

  await prisma.itemCarrinho.upsert({
    where: {
      carrinhoId_produtoVariacaoId: {
        carrinhoId: carrinho.id,
        produtoVariacaoId: data.produtoVariacaoId,
      },
    },
    update: {
      quantidade: {
        increment: quantidade,
      },
    },
    create: {
      carrinhoId: carrinho.id,
      produtoVariacaoId: data.produtoVariacaoId,
      quantidade,
    },
  });

  return listarCarrinho(data.usuarioId);
}

export async function atualizarItemCarrinho(data: AtualizarItemData) {
  const item = await prisma.itemCarrinho.findFirst({
    where: {
      id: data.itemId,
      carrinho: {
        usuarioId: data.usuarioId,
        finalizado: false,
      },
    },
  });

  if (!item) {
    return null;
  }

  if (data.quantidade <= 0) {
    await prisma.itemCarrinho.delete({
      where: {
        id: data.itemId,
      },
    });

    return listarCarrinho(data.usuarioId);
  }

  await prisma.itemCarrinho.update({
    where: {
      id: data.itemId,
    },
    data: {
      quantidade: data.quantidade,
    },
  });

  return listarCarrinho(data.usuarioId);
}

export async function removerItemCarrinho(usuarioId: number, itemId: number) {
  const item = await prisma.itemCarrinho.findFirst({
    where: {
      id: itemId,
      carrinho: {
        usuarioId,
        finalizado: false,
      },
    },
  });

  if (!item) {
    return null;
  }

  await prisma.itemCarrinho.delete({
    where: {
      id: itemId,
    },
  });

  return listarCarrinho(usuarioId);
}

export async function finalizarCarrinho(usuarioId: number) {
  const carrinho = await prisma.carrinho.findFirst({
    where: {
      usuarioId,
      finalizado: false,
    },
    include: carrinhoInclude,
  });

  if (!carrinho) {
    return null;
  }

  if (carrinho.itens.length === 0) {
    throw new Error("Carrinho vazio");
  }

  const carrinhoFinalizado = await prisma.carrinho.update({
    where: {
      id: carrinho.id,
    },
    data: {
      finalizado: true,
    },
    include: carrinhoInclude,
  });

  return carrinhoFinalizado;
}