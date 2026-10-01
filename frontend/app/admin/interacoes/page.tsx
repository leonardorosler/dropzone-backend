"use client";
import { useEffect,useState } from "react";
import { adminApi } from "@/lib/api";
import type { Avaliacao,Carrinho,Favorito } from "@/types/api";

export default function AdminInteracoesPage(){
  const [avaliacoes,setAvaliacoes]=useState<Avaliacao[]>([]);
  const [favoritos,setFavoritos]=useState<Favorito[]>([]);
  const [pedidos,setPedidos]=useState<Carrinho[]>([]);
  async function carregar(){
    const [a,f,p]=await Promise.all([adminApi.avaliacoes(),adminApi.favoritos(),adminApi.pedidos()]);
    setAvaliacoes(a);setFavoritos(f);setPedidos(p);
  }
  useEffect(()=>{carregar()},[]);
  async function responder(a:Avaliacao){
    const resposta=prompt("Resposta da DropZone:",a.respostaAdmin??""); if(!resposta)return;
    await adminApi.responderAvaliacao(a.id,resposta);await carregar();
  }
  async function excluir(id:number){if(!confirm("Excluir esta avaliação?"))return;await adminApi.excluirAvaliacao(id);await carregar()}

  return <>
    <div className="admin-heading"><small>CLIENTES</small><h1>INTERAÇÕES</h1></div>
    <section className="admin-section"><h2>Avaliações</h2><div className="admin-table">
      {avaliacoes.map(a=><article key={a.id}><div><b>{a.usuario?.nome??`Usuário ${a.usuarioId}`} · ★ {a.nota}</b><span>{a.comentario}</span>{a.respostaAdmin&&<small>Resposta: {a.respostaAdmin}</small>}</div>
      <div className="table-actions"><button onClick={()=>responder(a)}>Responder</button><button onClick={()=>excluir(a.id)}>Excluir</button></div></article>)}
    </div></section>
    <section className="admin-section"><h2>Favoritos</h2><p>{favoritos.length} interações registradas.</p></section>
    <section className="admin-section"><h2>Carrinhos / pedidos</h2><p>{pedidos.length} carrinhos registrados.</p></section>
  </>;
}
