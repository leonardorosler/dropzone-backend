import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";
import {
  atualizarDisponibilidadeProdutoController,
  atualizarProdutoController,
  buscarProdutoPorIdController,
  criarProdutoController,
  deletarProdutoController,
  listarProdutosController,
} from "./produtos.controller.js";

export const produtosRoutes = Router();

produtosRoutes.post("/", authMiddleware, adminMiddleware, criarProdutoController);

produtosRoutes.get("/", listarProdutosController);

produtosRoutes.get("/:id", buscarProdutoPorIdController);

produtosRoutes.put("/:id", authMiddleware, adminMiddleware, atualizarProdutoController);

produtosRoutes.patch(
  "/:id/disponibilidade",
  authMiddleware,
  adminMiddleware,
  atualizarDisponibilidadeProdutoController
);

produtosRoutes.delete("/:id", authMiddleware, adminMiddleware, deletarProdutoController);