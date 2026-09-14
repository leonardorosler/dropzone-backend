import { Router } from "express";
// import { listarCategoria } from "./categorias.service.js";
import { criarCategoriaController, listarCategoriaController } from "./categorias.controller.js"
import { authMiddleware, adminMiddleware } from "../../middlewares/auth.middleware.js"; 

export const categoriasRoutes = Router();

categoriasRoutes.get("/", listarCategoriaController); //feito
categoriasRoutes.post("/", authMiddleware, adminMiddleware, criarCategoriaController); // feito