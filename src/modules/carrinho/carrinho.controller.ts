import { Request, Response } from "express";
import {
  adicionarItemCarrinho,
  atualizarItemCarrinho,
  finalizarCarrinho,
  listarCarrinho,
  removerItemCarrinho,
} from "./carrinho.service.js";

export async function listarCarrinhoController(req: Request, res: Response) {
  try {
    const usuarioId = Number(req.usuarioId);

    const carrinho = await listarCarrinho(usuarioId);

    return res.status(200).json(carrinho);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao listar carrinho.",
    });
  }
}

export async function adicionarItemCarrinhoController(
  req: Request,
  res: Response
) {
  try {
    const usuarioId = Number(req.usuarioId);
    const { produtoVariacaoId, quantidade } = req.body;

    if (!Number.isInteger(Number(produtoVariacaoId))) {
      return res.status(400).json({
        mensagem: "produtoVariacaoId é obrigatório.",
      });
    }

    const carrinho = await adicionarItemCarrinho({
      usuarioId,
      produtoVariacaoId: Number(produtoVariacaoId),
      quantidade: quantidade === undefined ? undefined : Number(quantidade),
    });

    return res.status(201).json(carrinho);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Variação não encontrada" ||
        error.message === "Variação indisponível" ||
        error.message === "Quantidade inválida"
      ) {
        return res.status(400).json({
          mensagem: error.message,
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao adicionar item ao carrinho.",
    });
  }
}

export async function atualizarItemCarrinhoController(
  req: Request,
  res: Response
) {
  try {
    const usuarioId = Number(req.usuarioId);
    const itemId = Number(req.params.itemId);
    const { quantidade } = req.body;

    if (!Number.isInteger(itemId)) {
      return res.status(400).json({
        mensagem: "ID do item inválido.",
      });
    }

    if (!Number.isInteger(Number(quantidade))) {
      return res.status(400).json({
        mensagem: "Quantidade inválida.",
      });
    }

    const carrinho = await atualizarItemCarrinho({
      usuarioId,
      itemId,
      quantidade: Number(quantidade),
    });

    if (!carrinho) {
      return res.status(404).json({
        mensagem: "Item não encontrado no carrinho.",
      });
    }

    return res.status(200).json(carrinho);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao atualizar item do carrinho.",
    });
  }
}

export async function removerItemCarrinhoController(
  req: Request,
  res: Response
) {
  try {
    const usuarioId = Number(req.usuarioId);
    const itemId = Number(req.params.itemId);

    if (!Number.isInteger(itemId)) {
      return res.status(400).json({
        mensagem: "ID do item inválido.",
      });
    }

    const carrinho = await removerItemCarrinho(usuarioId, itemId);

    if (!carrinho) {
      return res.status(404).json({
        mensagem: "Item não encontrado no carrinho.",
      });
    }

    return res.status(200).json(carrinho);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao remover item do carrinho.",
    });
  }
}

export async function finalizarCarrinhoController(
  req: Request,
  res: Response
) {
  try {
    const usuarioId = Number(req.usuarioId);

    const carrinho = await finalizarCarrinho(usuarioId);

    if (!carrinho) {
      return res.status(404).json({
        mensagem: "Carrinho não encontrado.",
      });
    }

    return res.status(200).json({
      mensagem: "Carrinho finalizado com sucesso.",
      carrinho,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Carrinho vazio") {
      return res.status(400).json({
        mensagem: "Não é possível finalizar um carrinho vazio.",
      });
    }

    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao finalizar carrinho.",
    });
  }
}