"use client";

import { useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { produtosApi } from "@/lib/api";
import type { Produto } from "@/types/api";
import { CategoriasHome } from "./CategoriasHome";
import { HeroCarrossel } from "./HeroCarrossel";
import { LookIaHome } from "./LookIaHome";
import { ProductRail } from "./ProductRail";
import { PromocoesHome } from "./PromocoesHome";

export function DropzoneHome() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    let ativo = true;

    produtosApi
      .listar({ disponivel: true })
      .then((lista) => {
        if (ativo) setProdutos(lista);
      })
      .catch(() => {
        if (ativo) setProdutos([]);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const desejados = useMemo(() => {
    const destaques = produtos.filter((produto) => produto.destaque);
    return destaques.length >= 6 ? destaques : produtos;
  }, [produtos]);

  return (
    <>
      <Header />
      <main className="home-dropzone">
        <HeroCarrossel />
        <CategoriasHome />

        <section className="home-editorial">
          <div className="home-editorial-principal">
            <LookIaHome produtos={produtos} />
          </div>
          <PromocoesHome />
        </section>

        <ProductRail produtos={desejados} />
      </main>
      <Footer />
    </>
  );
}
