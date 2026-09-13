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
