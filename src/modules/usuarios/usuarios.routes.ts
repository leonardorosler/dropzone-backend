import { Router } from "express";
import { cadastraUsuarioController } from "./usuarios.controller.js";



export const usuariosRoutes = Router()

usuariosRoutes.post("/", cadastraUsuarioController) //cadastra usuário
