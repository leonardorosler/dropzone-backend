"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Produto } from "@/types/api";
import { favoritosApi } from "@/lib/api";
import { useAuth } from "./AuthProvider";

interface ProductCardProps {
  produto: Produto;
  modoHome?: boolean;
}

export function ProductCard({ produto, modoHome = false }: ProductCardProps) {
  const router = useRouter();
  const { usuario } = useAuth();
  const imagem =
    produto.imagens?.[0]?.imagemUrl ??
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=82";

  async function favoritar() {
    if (!usuario) {
      router.push("/login");
      return;
    }

    try {
      await favoritosApi.adicionar(produto.id);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao favoritar.");
    }
  }

  return (
    <article
      className={modoHome ? "product-card product-card-home" : "product-card"}
      onMouseEnter={() => router.prefetch(`/produtos/${produto.id}`)}
    >
      <div className="product-media">
        <Link href={`/produtos/${produto.id}`} prefetch>
          <img src={imagem} alt={produto.nome} loading="lazy" decoding="async" />
        </Link>

        {(modoHome || produto.destaque) && <span className="badge">NOVO</span>}

        <button
          className="favorite-btn"
          aria-label={`Favoritar ${produto.nome}`}
          onClick={favoritar}
        >
          <Heart size={18} />
        </button>
      </div>

      <Link href={`/produtos/${produto.id}`} className="product-info" prefetch>
        {!modoHome && (
          <small className="product-category">{produto.categoria?.nome ?? "DROPZONE"}</small>
        )}
        <strong>{produto.nome}</strong>

        {!modoHome && (
          <div className="color-dots" aria-label="Cores disponíveis">
            {produto.variacoes?.slice(0, 4).map((variacao) => (
              <span
                key={variacao.id}
                title={variacao.cor?.nome ?? "Cor"}
                style={{ background: variacao.cor?.hex ?? "#202020" }}
              />
            ))}
          </div>
        )}

        <b>R$ {Number(produto.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</b>
      </Link>
    </article>
  );
}
