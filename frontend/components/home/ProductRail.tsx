"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Produto } from "@/types/api";

const produtosDemo = [
  { nome: "Tee Oversized Ruído", preco: "149,90", imagem: "/home/produto-demo-01.webp", busca: "camiseta" },
  { nome: "Moletom Heavy Chumbo", preco: "279,90", imagem: "/home/produto-demo-02.webp", busca: "moletom" },
  { nome: "Cargo Utility 013", preco: "229,90", imagem: "/home/produto-demo-03.webp", busca: "cargo" },
  { nome: "Tee Boxy Off White", preco: "159,90", imagem: "/home/produto-demo-04.webp", busca: "camiseta" },
  { nome: "Hoodie Drop Heavy", preco: "299,90", imagem: "/home/produto-demo-05.webp", busca: "moletom" },
  { nome: "Bermuda Baggy 13", preco: "189,90", imagem: "/home/produto-demo-06.webp", busca: "bermuda" },
  { nome: "Tênis Street Concrete", preco: "399,90", imagem: "/home/produto-demo-07.webp", busca: "tênis" },
  { nome: "Boné 5 Panel Ruído", preco: "119,90", imagem: "/home/produto-demo-08.webp", busca: "boné" },
];

interface ProductRailProps {
  produtos: Produto[];
}

export function ProductRail({ produtos }: ProductRailProps) {
  const trilho = useRef<HTMLDivElement>(null);

  function mover(direcao: number) {
    trilho.current?.scrollBy({ left: direcao * 620, behavior: "smooth" });
  }

  return (
    <section className="home-desejados">
      <div className="home-secao-titulo">
        <div>
          <h2><span>MAIS</span> DESEJADOS</h2>
          <p>Os produtos que a galera mais tá levando.</p>
        </div>
        <Link href="/catalogo" prefetch>VER TODOS →</Link>
      </div>

      <div className="home-produtos-wrap">
        <button className="rail-seta esquerda" onClick={() => mover(-1)} aria-label="Produtos anteriores">
          <ChevronLeft size={22} />
        </button>

        <div className="home-produtos-trilho" ref={trilho}>
          {produtos.length > 0
            ? produtos.slice(0, 12).map((produto) => (
                <ProductCard key={produto.id} produto={produto} modoHome />
              ))
            : produtosDemo.map((produto) => (
                <Link
                  href={`/catalogo?busca=${encodeURIComponent(produto.busca)}`}
                  className="produto-demo-card"
                  key={produto.nome}
                >
                  <div>
                    <img src={produto.imagem} alt={produto.nome} loading="lazy" />
                    <span>NOVO</span>
                    <Heart size={19} />
                  </div>
                  <strong>{produto.nome}</strong>
                  <b>R$ {produto.preco}</b>
                </Link>
              ))}
        </div>

        <button className="rail-seta direita" onClick={() => mover(1)} aria-label="Próximos produtos">
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}
