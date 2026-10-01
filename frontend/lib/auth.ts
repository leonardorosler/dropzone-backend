import type { Usuario } from "@/types/api";
const TOKEN_KEY = "dropzone_token";
const USER_KEY = "dropzone_usuario";
export function salvarSessao(token:string, usuario:Usuario){
  if(typeof window==="undefined") return;
  localStorage.setItem(TOKEN_KEY,token);
  localStorage.setItem(USER_KEY,JSON.stringify(usuario));
}
export function getToken(){ return typeof window==="undefined" ? null : localStorage.getItem(TOKEN_KEY); }
export function getUsuario():Usuario|null{
  if(typeof window==="undefined") return null;
  const value=localStorage.getItem(USER_KEY);
  if(!value) return null;
  try{return JSON.parse(value) as Usuario}catch{return null}
}
export function logout(){
  if(typeof window==="undefined") return;
  localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY);
}
