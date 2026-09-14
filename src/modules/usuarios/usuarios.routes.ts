import { Router } from "express";
import { cadastraUsuarioController } from "./usuarios.controller.js";

export const usuariosRoutes = Router()

usuariosRoutes.post("/", cadastraUsuarioController) //cadastra usuário

//get usuarios/me -> receber dados do usuario autenticado

//put usuarios/me -> atualizar dados do usuario autenticado

//delete usuarios/me-> excluir ou desativar a propria conta
