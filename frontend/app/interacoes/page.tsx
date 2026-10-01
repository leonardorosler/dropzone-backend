"use client";

import Link from "next/link";
import { Heart, MessageSquareText, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { usuariosApi } from "@/lib/api";
import type { InteracoesUsuario } from "@/types/api";

export default function InteracoesPage() {
  const [dados, setDados] = useState<InteracoesUsuario | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    usuariosApi
      .minhasInteracoes()
      .then(setDados)
      .catch((error) => {
        setErro(error instanceof Error ? error.message : "Erro ao carregar sua conta.");
      });
  }, []);

  return (
    <>
      <Header />

      <main className="page-shell street-page">
        <header className="page-title street-page-title">
          <span>MINHA CONTA / DROPZONE</span>
          <h1>MINHAS INTERAÇÕES</h1>
          <p>Um resumo do que você salvou, avaliou e colocou no carrinho.</p>
        </header>

        {erro ? (
          <div className="street-empty">
            <strong>Não foi possível abrir sua conta.</strong>
            <p>{erro}</p>
            <Link className="btn street-btn-primary" href="/login">
              FAZER LOGIN
            </Link>
          </div>
        ) : !dados ? (
          <div className="street-status">Carregando sua conta...</div>
        ) : (
          <div className="street-account-grid">
            <Link href="/favoritos" className="street-account-card">
              <Heart size={24} />
              <span>FAVORITOS</span>
              <strong>{dados.favoritos.length}</strong>
              <small>Peças que você quer rever.</small>
            </Link>

            <div className="street-account-card">
              <MessageSquareText size={24} />
              <span>AVALIAÇÕES</span>
              <strong>{dados.avaliacoes.length}</strong>
              <small>Opiniões que você já enviou.</small>
            </div>

            <Link href="/carrinho" className="street-account-card">
              <ShoppingBag size={24} />
              <span>CARRINHOS / PEDIDOS</span>
              <strong>{dados.carrinhos.length}</strong>
              <small>Movimentações registradas na loja.</small>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
