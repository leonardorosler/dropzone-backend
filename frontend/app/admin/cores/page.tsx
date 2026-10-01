"use client";
import { SimpleCrud } from "@/components/SimpleCrud";
import { coresApi } from "@/lib/api";
export default function Page(){return <SimpleCrud titulo="CORES" listar={coresApi.listar} criar={data=>coresApi.criar(data)} atualizar={(id,data)=>coresApi.atualizar(id,data)} deletar={coresApi.deletar} usaHex/>;}
