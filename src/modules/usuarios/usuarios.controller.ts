import { Request, Response } from "express";
import { buscarInteracoesUsuario } from "./usuarios.service.js";

export async function minhasInteracoesController(
  req: Request,
  res: Response
) {
  try {
    const usuarioId = req.usuarioId;

    if (!usuarioId) {
      return res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
    }

    const interacoes = await buscarInteracoesUsuario(usuarioId);

    return res.status(200).json(interacoes);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao buscar interações do usuário.",
    });
  }
}
