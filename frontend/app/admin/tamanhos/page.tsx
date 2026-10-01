"use client";
import { SimpleCrud } from "@/components/SimpleCrud";
import { tamanhosApi } from "@/lib/api";
export default function Page(){return <SimpleCrud titulo="TAMANHOS" listar={tamanhosApi.listar} criar={({nome})=>tamanhosApi.criar(nome)} atualizar={(id,{nome})=>tamanhosApi.atualizar(id,nome)} deletar={tamanhosApi.deletar}/>;}
