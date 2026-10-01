"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { loginLocal } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      const resposta = await authApi.login(email, senha);
      loginLocal(resposta.token, resposta.usuario);
      router.push(resposta.usuario.role === "ADMIN" ? "/admin" : "/");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao entrar.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="auth-page street-auth-page">
      <Link href="/" className="street-auth-back">
        ← VOLTAR PARA A LOJA
      </Link>

      <section className="street-auth-card">
        <div className="street-auth-brand">
          <img src="/home/logo-dropzone.png" alt="DropZone" />
          <span>STREETWEAR BRASILEIRO</span>
        </div>

        <div className="street-auth-heading">
          <small>MINHA CONTA</small>
          <h1>ENTRAR</h1>
          <p>Acesse seus favoritos, carrinho e histórico.</p>
        </div>

        <form onSubmit={entrar} className="street-auth-form">
          <label>
            E-mail
            <div className="street-input-icon">
              <Mail size={17} />
              <input
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label>
            Senha
            <div className="street-input-icon">
              <LockKeyhole size={17} />
              <input
                type="password"
                value={senha}
                onChange={(evento) => setSenha(evento.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {erro && <p className="street-form-error">{erro}</p>}

          <button className="btn street-btn-primary full" disabled={enviando}>
            {enviando ? "ENTRANDO..." : "ENTRAR"}
            {!enviando && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="street-auth-link">
          Ainda não tem conta? <Link href="/cadastro">Criar cadastro</Link>
        </p>
      </section>
    </main>
  );
}
