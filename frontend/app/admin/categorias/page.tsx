"use client";
import { SimpleCrud } from "@/components/SimpleCrud";
import { categoriasApi } from "@/lib/api";
export default function Page(){return <SimpleCrud titulo="CATEGORIAS" listar={categoriasApi.listar} criar={({nome})=>categoriasApi.criar(nome)} atualizar={(id,{nome})=>categoriasApi.atualizar(id,nome)} deletar={categoriasApi.deletar}/>;}
