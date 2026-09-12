import { Router } from "express";

import {
  criarProdutoController,
  listarProdutosController,
} from "./produtos.controller.js";

export const produtosRoutes = Router();

produtosRoutes.post("/", criarProdutoController);
produtosRoutes.get("/", listarProdutosController);