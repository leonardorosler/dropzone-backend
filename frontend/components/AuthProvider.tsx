"use client";
import { createContext,useContext,useEffect,useMemo,useState } from "react";
import type { Usuario } from "@/types/api";
import { getUsuario, logout as limparSessao, salvarSessao } from "@/lib/auth";

interface AuthContextValue {
  usuario:Usuario|null;
  carregando:boolean;
  loginLocal:(token:string,usuario:Usuario)=>void;
  logout:()=>void;
}
const AuthContext=createContext<AuthContextValue|null>(null);

export function AuthProvider({children}:{children:React.ReactNode}){
  const [usuario,setUsuario]=useState<Usuario|null>(null);
  const [carregando,setCarregando]=useState(true);

  useEffect(()=>{ setUsuario(getUsuario()); setCarregando(false); },[]);

  const value=useMemo<AuthContextValue>(()=>({
    usuario,carregando,
    loginLocal(token,user){ salvarSessao(token,user); setUsuario(user); },
    logout(){ limparSessao(); setUsuario(null); }
  }),[usuario,carregando]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){
  const context=useContext(AuthContext);
  if(!context) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return context;
}
