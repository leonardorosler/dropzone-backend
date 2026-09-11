import { Request, Response } from "express"
import { criarCategoria, listarCategoria } from "./categorias.service.js"

export async function criarCategoriaController(req: Request, res: Response){
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ message: "nome é obrigatório"})
    }

    const categoria = await criarCategoria({nome});

    return res.status(201).json(categoria);
}

export async function listarCategoriaController(req: Request, res: Response){
    const categoria = listarCategoria //fazer
}