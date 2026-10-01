"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { usuariosApi } from "@/lib/api";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function cadastrar(evento: FormEvent) {
    evento.preventDefault();
    setMensagem("");
    setErro("");
    setEnviando(true);

    try {
      await usuariosApi.cadastrar({ nome, email, senha });
      setMensagem("Cadastro criado. Agora você já pode entrar.");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao criar cadastro.");
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
          <small>FAÇA PARTE</small>
          <h1>CRIAR CONTA</h1>
          <p>Salve peças, monte looks e finalize pedidos pelo WhatsApp.</p>
        </div>

        <form onSubmit={cadastrar} className="street-auth-form">
          <label>
            Nome
            <div className="street-input-icon">
              <UserRound size={17} />
              <input value={nome} onChange={(evento) => setNome(evento.target.value)} required />
            </div>
          </label>

          <label>
            E-mail
            <div className="street-input-icon">
              <Mail size={17} />
              <input
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
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
                required
              />
            </div>
          </label>

          {mensagem && <p className="street-form-success">{mensagem}</p>}
          {erro && <p className="street-form-error">{erro}</p>}

          <button className="btn street-btn-primary full" disabled={enviando}>
            {enviando ? "CRIANDO..." : "CRIAR CONTA"}
            {!enviando && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="street-auth-link">
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
