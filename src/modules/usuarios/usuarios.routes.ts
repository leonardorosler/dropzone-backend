import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { minhasInteracoesController } from "./usuarios.controller.js";

export const usuariosRoutes = Router();

usuariosRoutes.get(
  "/me/interacoes",
  authMiddleware,
  minhasInteracoesController
);
