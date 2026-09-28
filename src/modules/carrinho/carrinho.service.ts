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

function formatarPreco(valor: unknown) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function gerarMensagemWhatsApp(carrinho: {
  itens: Array<{
    quantidade: number;
    produtoVariacao: {
      produto: {
        nome: string;
        preco: unknown;
      };
      cor: {
        nome: string;
      } | null;
      tamanho: {
        nome: string;
      };
    };
  }>;
}) {
  const linhas = carrinho.itens.map((item) => {
    const produto = item.produtoVariacao.produto;
    const cor = item.produtoVariacao.cor?.nome ?? "Sem cor";
    const tamanho = item.produtoVariacao.tamanho.nome;
    const precoUnitario = Number(produto.preco);
    const subtotal = precoUnitario * item.quantidade;

    return `- ${produto.nome} | Cor: ${cor} | Tamanho: ${tamanho} | Quantidade: ${item.quantidade} | Valor: ${formatarPreco(subtotal)}`;
  });

  const total = carrinho.itens.reduce((soma, item) => {
    return soma + Number(item.produtoVariacao.produto.preco) * item.quantidade;
  }, 0);

  return [
    "Olá! Tenho interesse nestas peças:",
    "",
    ...linhas,
    "",
    `Total aproximado: ${formatarPreco(total)}`,
    "",
    "Gostaria de saber mais sobre o pedido.",
  ].join("\n");
}

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

  const mensagemWhatsApp = gerarMensagemWhatsApp(carrinhoFinalizado);

  const telefoneLoja = process.env.WHATSAPP_LOJA ?? "";
  const textoEncoded = encodeURIComponent(mensagemWhatsApp);

  const linkWhatsApp = telefoneLoja
    ? `https://wa.me/${telefoneLoja}?text=${textoEncoded}`
    : `https://wa.me/?text=${textoEncoded}`;

  return {
    carrinho: carrinhoFinalizado,
    mensagemWhatsApp,
    linkWhatsApp,
  };
}