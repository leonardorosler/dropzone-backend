import express from "express"
import cors from "cors"

import { categoriasRoutes } from "./modules/categorias/categorias.routes.js"
import { produtosRoutes } from "./modules/produtos/produtos.routes.js"
import { usuariosRoutes } from "./modules/usuarios/usuarios.routes.js"
import { authRoutes } from "./modules/auth/auth.routes.js"
import { favoritosRoutes } from "./modules/favoritos/favoritos.routes.js"


export const app = express()

app.use(cors())
app.use(express.json())

app.get("/teste", (req, res)=>{
    res.json({status: "server rodando"})
})

app.use("/categorias", categoriasRoutes)
app.use("/produtos", produtosRoutes);
app.use("/usuarios", usuariosRoutes)
app.use("/auth", authRoutes);
app.use("/favoritos", favoritosRoutes);