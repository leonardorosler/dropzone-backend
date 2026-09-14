import { Request, Response } from "express";
import { cadastraUsuario } from "./usuarios.service.js";

export async function cadastraUsuarioController(req: Request, res: Response) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem:
          "nome, email e senha são obrigatórios",
      });
    }

    const usuario = await cadastraUsuario({
        nome,
        email,
        senha
    })

    return(res.status(201).json(usuario))

  } catch (error) {
    if (error instanceof Error && error.message === "Email já cadastrado"){
        return res.status(409).json({menagem: error.message})
    }

    console.error(error);
    
    return res.status(500).json({
      mensagem: "Erro ao cadastrar usuário.",
    });
  }
}
