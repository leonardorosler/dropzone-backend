import bcrypt from "bcrypt";
import { prisma } from "../database/prisma.js";

async function criarAdmin() {
  const senhaHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.usuario.create({
    data: {
      nome: "Administrador",
      email: "admin@dropzone.com",
      senhaHash,
      role: "ADMIN",
    },
  });

  console.log(admin);
}


criarAdmin();