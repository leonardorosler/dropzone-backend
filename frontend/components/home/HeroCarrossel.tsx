"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  "/home/hero-01.webp",
  "/home/hero-02.webp",
  "/home/hero-03.webp",
];

export function HeroCarrossel() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setIndice((valor) => (valor + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(intervalo);
  }, []);

  function voltar() {
    setIndice((valor) => (valor - 1 + slides.length) % slides.length);
  }

  function avancar() {
    setIndice((valor) => (valor + 1) % slides.length);
  }

  return (
    <section className="home-hero" aria-label="Campanhas DropZone">
      {slides.map((slide, posicao) => (
        <img
          key={slide}
          src={slide}
          alt=""
          aria-hidden="true"
          className={posicao === indice ? "hero-slide ativo" : "hero-slide"}
          loading={posicao === 0 ? "eager" : "lazy"}
        />
      ))}

      <h1 className="sr-only">DropZone — streetwear brasileiro</h1>

      <Link
        href="/catalogo"
        className="hero-link-principal"
        aria-label="Conferir novidades da DropZone"
      />

      <button className="hero-seta esquerda" onClick={voltar} aria-label="Campanha anterior">
        <ChevronLeft size={22} />
      </button>

      <button className="hero-seta direita" onClick={avancar} aria-label="Próxima campanha">
        <ChevronRight size={22} />
      </button>

      <div className="hero-indicadores" aria-label="Selecionar campanha">
        {slides.map((slide, posicao) => (
          <button
            key={slide}
            className={posicao === indice ? "ativo" : ""}
            onClick={() => setIndice(posicao)}
            aria-label={`Abrir campanha ${posicao + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
