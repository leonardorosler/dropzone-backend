"use client";
import { FormEvent,useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { categoriasApi,produtosApi } from "@/lib/api";
import type { Categoria } from "@/types/api";

export default function NovoProdutoPage(){
  const router=useRouter();
  const [categorias,setCategorias]=useState<Categoria[]>([]);
  const [nome,setNome]=useState(""); const [descricao,setDescricao]=useState("");
  const [preco,setPreco]=useState(""); const [categoriaId,setCategoriaId]=useState("");
  const [destaque,setDestaque]=useState(false);
  const [imagemUrl,setImagemUrl]=useState("");

  useEffect(()=>{categoriasApi.listar().then(setCategorias)},[]);
  async function submit(e:FormEvent){
    e.preventDefault();
    await produtosApi.criar({nome,descricao,preco:Number(preco),categoriaId:Number(categoriaId),destaque,imagemUrl:imagemUrl||undefined});
    router.push("/admin/produtos");
  }

  return <>
    <div className="admin-heading"><small>PRODUTOS</small><h1>NOVO PRODUTO</h1></div>
    <form className="admin-form" onSubmit={submit}>
      <label>Nome<input value={nome} onChange={e=>setNome(e.target.value)} required/></label>
      <label>Descrição<textarea value={descricao} onChange={e=>setDescricao(e.target.value)} required/></label>
      <label>Preço<input type="number" step="0.01" value={preco} onChange={e=>setPreco(e.target.value)} required/></label>
      <label>Imagem (URL)<input value={imagemUrl} onChange={e=>setImagemUrl(e.target.value)} placeholder="https://..."/></label>
      <label>Categoria<select value={categoriaId} onChange={e=>setCategoriaId(e.target.value)} required>
        <option value="">Selecione</option>{categorias.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
      </select></label>
      <label className="check-row"><input type="checkbox" checked={destaque} onChange={e=>setDestaque(e.target.checked)}/>Produto em destaque</label>
      <button className="btn btn-primary">SALVAR PRODUTO</button>
    </form>
  </>;
}
