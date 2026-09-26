import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";
import {    atualizarDisponibilidadeProdutoController,
  atualizarProdutoController,
  criarProdutoController,
  deletarProdutoController,
  listarProdutosController,
} from "./produtos.controller.js";

export const produtosRoutes = Router();
///incluir produto
produtosRoutes.post("/", authMiddleware, adminMiddleware, criarProdutoController);

//listar produto
produtosRoutes.get("/", listarProdutosController);

///editar produto existente
produtosRoutes.put("/:id", authMiddleware, adminMiddleware, atualizarProdutoController);


// atualizar disponibilidade 
produtosRoutes.patch(  "/:id/disponibilidade", authMiddleware, adminMiddleware, atualizarDisponibilidadeProdutoController);


//************* cuidado ************ */
///deleta do banco
produtosRoutes.delete("/:id", authMiddleware, adminMiddleware, deletarProdutoController);