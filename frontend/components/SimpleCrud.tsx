"use client";
import { FormEvent,useEffect,useState } from "react";
type Item={id:number;nome:string;hex?:string|null};
interface Props{
  titulo:string;
  listar:()=>Promise<Item[]>;
  criar:(data:{nome:string;hex?:string})=>Promise<unknown>;
  atualizar:(id:number,data:{nome:string;hex?:string})=>Promise<unknown>;
  deletar:(id:number)=>Promise<unknown>;
  usaHex?:boolean;
}
export function SimpleCrud({titulo,listar,criar,atualizar,deletar,usaHex=false}:Props){
  const [itens,setItens]=useState<Item[]>([]); const [nome,setNome]=useState(""); const [hex,setHex]=useState("#111111");
  async function carregar(){setItens(await listar())}
  useEffect(()=>{carregar()},[]);
  async function submit(e:FormEvent){e.preventDefault();await criar({nome,hex:usaHex?hex:undefined});setNome("");await carregar()}
  async function editar(item:Item){
    const novoNome=prompt("Novo nome:",item.nome); if(!novoNome)return;
    const novoHex=usaHex?(prompt("Novo HEX:",item.hex??"#111111")??item.hex??undefined):undefined;
    await atualizar(item.id,{nome:novoNome,hex:novoHex});await carregar();
  }
  async function excluir(id:number){if(!confirm("Excluir este registro?"))return;await deletar(id);await carregar()}
  return <>
    <div className="admin-heading"><small>GESTÃO</small><h1>{titulo}</h1></div>
    <form className="inline-form" onSubmit={submit}>
      <input placeholder={`Nova ${titulo.toLowerCase()}`} value={nome} onChange={e=>setNome(e.target.value)} required/>
      {usaHex&&<input type="color" value={hex} onChange={e=>setHex(e.target.value)}/>}
      <button className="btn btn-primary">ADICIONAR</button>
    </form>
    <div className="admin-table">{itens.map(item=><article key={item.id}>
      <div className="name-with-color">{usaHex&&<span className="admin-color-dot" style={{background:item.hex??"#111111"}}/>}<b>{item.nome}</b></div>
      <div className="table-actions"><button onClick={()=>editar(item)}>Editar</button><button onClick={()=>excluir(item.id)}>Excluir</button></div>
    </article>)}</div>
  </>;
}
