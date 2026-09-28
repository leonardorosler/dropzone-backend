import bcrypt from "bcrypt";
import { prisma } from "../../database/prisma.js";

interface cadastraUsuarioData {
  nome: string;
  email: string;
  senha: string;
}

export async function cadastraUsuario(data: cadastraUsuarioData) {
 
  const usuarioExistente = await prisma.usuario.findUnique({
    where: {
      email: data.email,
    },
  });

  if (usuarioExistente) {
  throw new Error("Email já cadastrado");
}

  const senhaHash = await bcrypt.hash(data.senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome: data.nome,
      email: data.email,
      senhaHash,
    },
    select:{
        id: true,
        nome: true,
        email: true,
        role: true,
        criadoEm: true,
        atualizadoEm: true,
    }
  });

  return usuario;
}

export async function buscarUsuarioPorId(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  return usuario;
}

export async function listarInteracoesUsuario(usuarioId: number) {
  const [favoritos, avaliacoes, carrinhosFinalizados] = await Promise.all([
    prisma.favorito.findMany({
      where: {
        usuarioId,
      },
      include: {
        produto: {
          include: {
            imagens: true,
            categoria: true,
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
          include: {
            imagens: true,
            categoria: true,
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
        finalizado: true,
      },
      include: {
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
      },
      orderBy: {
        atualizadoEm: "desc",
      },
    }),
  ]);

  return {
    favoritos,
    avaliacoes,
    carrinhosFinalizados,
  };
}