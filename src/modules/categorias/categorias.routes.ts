import { Router } from "express";
// import { listarCategoria } from "./categorias.service.js";
import { criarCategoriaController, listarCategoriaController } from "./categorias.controller.js"; 

export const categoriasRoutes = Router();

categoriasRoutes.get("/", listarCategoriaController); //tem q fazer

categoriasRoutes.post("/", criarCategoriaController); // feito