import {Router} from 'express';
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { atualizarAvaliacaoController, criarAvaliacaoController, deletarAvaliacaoController, listarAvaliacoesProdutoController } from './avaliacoes.controller.js';

const avaliacoes = Router();

avaliacoes.post("/", authMiddleware, criarAvaliacaoController);

avaliacoes.get("/:produtoId", listarAvaliacoesProdutoController);

avaliacoes.put("/:id", authMiddleware, atualizarAvaliacaoController);

avaliacoes.delete("/:id", authMiddleware, deletarAvaliacaoController);

