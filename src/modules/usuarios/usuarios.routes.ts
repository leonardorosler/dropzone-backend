import { Router } from "express";
import {buscarUsuarioLogadoController, cadastraUsuarioController } from "./usuarios.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

export const usuariosRoutes = Router();

usuariosRoutes.post("/", cadastraUsuarioController);

usuariosRoutes.get("/me", authMiddleware, buscarUsuarioLogadoController);