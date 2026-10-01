"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
export function AdminGuard({children}:{children:React.ReactNode}){
  const router=useRouter();
  const {usuario,carregando}=useAuth();
  useEffect(()=>{
    if(!carregando && (!usuario || usuario.role!=="ADMIN")) router.replace("/login");
  },[usuario,carregando,router]);
  if(carregando || !usuario || usuario.role!=="ADMIN") return <div className="admin-loading">Validando acesso...</div>;
  return <>{children}</>;
}
