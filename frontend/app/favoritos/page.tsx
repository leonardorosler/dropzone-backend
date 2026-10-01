"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { favoritosApi } from "@/lib/api";
import type { Favorito } from "@/types/api";

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    favoritosApi
      .listar()
      .then(setFavoritos)
      .catch((error) => {
        setErro(error instanceof Error ? error.message : "Erro ao carregar favoritos.");
      })
      .finally(() => setCarregando(false));
  }, []);

  const produtos = favoritos.filter((favorito) => favorito.produto);

  return (
    <>
      <Header />

      <main className="page-shell street-page">
        <header className="page-title street-page-title">
          <span>MINHA CONTA / DROPZONE</span>
          <h1>FAVORITOS</h1>
          <p>As peças que você separou para voltar depois.</p>
        </header>

        {carregando ? (
          <div className="street-status">Carregando seus favoritos...</div>
        ) : erro ? (
          <div className="street-empty">
            <Heart size={28} />
            <strong>Entre para ver seus favoritos.</strong>
            <p>{erro}</p>
            <Link className="btn street-btn-primary" href="/login">
              ENTRAR NA MINHA CONTA
            </Link>
          </div>
        ) : produtos.length === 0 ? (
          <div className="street-empty">
            <Heart size={28} />
            <strong>Você ainda não favoritou nenhuma peça.</strong>
            <p>Explore o catálogo e salve o que combina com o seu estilo.</p>
            <Link className="btn street-btn-primary" href="/catalogo">
              EXPLORAR CATÁLOGO
            </Link>
          </div>
        ) : (
          <div className="product-grid four street-product-grid">
            {produtos.map((favorito) => (
              <ProductCard key={favorito.id} produto={favorito.produto!} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
