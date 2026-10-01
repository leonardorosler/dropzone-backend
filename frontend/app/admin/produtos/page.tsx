"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { produtosApi } from "@/lib/api";
import type { Produto } from "@/types/api";

export default function AdminProdutosPage(){
  const [produtos,setProdutos]=useState<Produto[]>([]);
  async function carregar(){setProdutos(await produtosApi.listar())}
  useEffect(()=>{carregar()},[]);
  async function toggle(p:Produto){await produtosApi.atualizarDisponibilidade(p.id,!p.disponivel);await carregar()}
  async function deletar(id:number){if(!confirm("Excluir este produto?"))return;await produtosApi.deletar(id);await carregar()}
  return <>
    <div className="admin-heading row">
      <div><small>GESTÃO</small><h1>PRODUTOS</h1></div>
      <Link className="btn btn-primary" href="/admin/produtos/novo">NOVO PRODUTO</Link>
    </div>
    <div className="admin-table">{produtos.map(p=><article key={p.id}>
      <div><b>{p.nome}</b><span>R$ {Number(p.preco).toLocaleString("pt-BR",{minimumFractionDigits:2})}</span></div>
      <div className="table-actions">
        <button onClick={()=>toggle(p)}>{p.disponivel?"Desativar":"Ativar"}</button>
        <button onClick={()=>deletar(p.id)}>Excluir</button>
      </div>
    </article>)}</div>
  </>;
}
