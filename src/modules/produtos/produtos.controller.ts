import type { Request, Response } from "express";
import { criarProduto, listarProdutos } from "./produtos.service.js";

export async function criarProdutoController(  req: Request,  res: Response) 
{
  try {
    
    const {
      nome,
      descricao,
      preco,
      imagemUrl,
      categoriaId,
    } = req.body;

    if (!nome || !descricao || preco === undefined || !categoriaId) {
      return res.status(400).json({
        mensagem:
          "nome, descrição, preço e categoriaId são obrigatórios",
      });
    }

    const produto = await criarProduto({
      nome,
      descricao,
      preco: Number(preco),
      imagemUrl,
      categoriaId,
    });

    if (!produto) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada.",
      });
    }

    return res.status(201).json(produto);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao criar produto.",
    });
  }
}


export async function listarProdutosController(
  _req: Request,  res: Response)

  {
  try {
    const produtos = await listarProdutos();

    return res.status(200).json(produtos);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao listar produtos.",
    });
  }
}