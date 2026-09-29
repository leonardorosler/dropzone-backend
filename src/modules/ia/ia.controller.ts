import { Request, Response } from "express";
import { gerarSugestaoLook } from "./ia.service.js";

export async function sugestaoLookController(
  req: Request,
  res: Response
) {
  try {
    const produtoId = Number(req.body.produtoId);

    if (!Number.isInteger(produtoId)) {
      return res.status(400).json({
        mensagem: "produtoId é obrigatório e deve ser um número inteiro.",
      });
    }

    const sugestao = await gerarSugestaoLook(produtoId);

    return res.status(200).json(sugestao);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PRODUTO_NAO_ENCONTRADO"
    ) {
      return res.status(404).json({
        mensagem: "Produto não encontrado.",
      });
    }

    if (
      error instanceof Error &&
      error.message === "GEMINI_API_KEY não configurada"
    ) {
      return res.status(500).json({
        mensagem: "Integração com IA não configurada.",
      });
    }

    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao gerar sugestão de look.",
    });
  }
}
