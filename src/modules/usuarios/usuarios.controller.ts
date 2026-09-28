import { Request, Response } from "express";
import { cadastraUsuario, buscarUsuarioPorId } from "./usuarios.service.js";

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

export async function buscarUsuarioLogadoController(
  req: Request,
  res: Response
) {
  try {
    const usuarioId = Number(req.usuarioId);

    if (!Number.isInteger(usuarioId)) {
      return res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
    }

    const usuario = await buscarUsuarioPorId(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao buscar usuário logado.",
    });
  }
}