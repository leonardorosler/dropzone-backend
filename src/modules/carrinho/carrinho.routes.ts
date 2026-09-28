import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adicionarItemCarrinhoController, atualizarItemCarrinhoController, finalizarCarrinhoController, listarCarrinhoController, removerItemCarrinhoController} from "./carrinho.controller.js";

export const carrinhoRoutes = Router();

carrinhoRoutes.get("/", authMiddleware, listarCarrinhoController);

carrinhoRoutes.post(
  "/itens",
  authMiddleware,
  adicionarItemCarrinhoController
);

carrinhoRoutes.patch(
  "/itens/:itemId",
  authMiddleware,
  atualizarItemCarrinhoController
);

carrinhoRoutes.delete(
  "/itens/:itemId",
  authMiddleware,
  removerItemCarrinhoController
);

carrinhoRoutes.post(
  "/finalizar",
  authMiddleware,
  finalizarCarrinhoController
);