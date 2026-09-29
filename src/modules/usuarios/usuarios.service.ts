import { prisma } from "../../database/prisma.js";

export async function buscarInteracoesUsuario(usuarioId: number) {
  const [favoritos, avaliacoes, carrinhos] = await Promise.all([
    prisma.favorito.findMany({
      where: {
        usuarioId,
      },
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
            preco: true,
            disponivel: true,
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    }),

    prisma.avaliacao.findMany({
      where: {
        usuarioId,
      },
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    }),

    prisma.carrinho.findMany({
      where: {
        usuarioId,
      },
      include: {
        itens: {
          include: {
            produtoVariacao: {
              include: {
                produto: {
                  select: {
                    id: true,
                    nome: true,
                    preco: true,
                  },
                },
                cor: true,
                tamanho: true,
              },
            },
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    }),
  ]);

  return {
    favoritos,
    avaliacoes,
    carrinhos,
  };
}
