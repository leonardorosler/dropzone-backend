"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

const menu = [
  { nome: "Novidades", href: "/catalogo" },
  { nome: "Masculino", href: "/catalogo?busca=oversized" },
  { nome: "Feminino", href: "/catalogo" },
  { nome: "Acessórios", href: "/catalogo?busca=acessório" },
  { nome: "Coleções", href: "/catalogo?busca=drop" },
  { nome: "Looks IA", href: "/#looks-ia" },
];

export function Header() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    router.prefetch("/catalogo");
    router.prefetch("/favoritos");
    router.prefetch("/carrinho");
    router.prefetch(usuario ? "/interacoes" : "/login");
  }, [router, usuario]);

  function buscar(evento: FormEvent) {
    evento.preventDefault();
    const termo = busca.trim();
    router.push(`/catalogo${termo ? `?busca=${encodeURIComponent(termo)}` : ""}`);
    setMenuAberto(false);
  }

  return (
    <>
      <div className="topbar dropzone-topbar">
        <span>⚡ FRETE GRÁTIS <em>acima de R$ 299</em></span>
        <span>STREETWEAR BRASILEIRO <i>•</i> QUALIDADE <i>•</i> ATITUDE <i>•</i> ESTILO REAL</span>
        <span>SEJA MEMBRO <i>•</i> GANHE DESCONTOS EXCLUSIVOS</span>
      </div>

      <header className="header dropzone-header">
        <button
          className="icon-btn mobile-menu"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuAberto((valor) => !valor)}
        >
          {menuAberto ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link href="/" className="brand brand-imagem" prefetch aria-label="DropZone - início">
          <img src="/home/logo-dropzone.png" alt="DropZone" />
        </Link>

        <nav className={menuAberto ? "nav nav-open" : "nav"}>
          {menu.map((item) => (
            <Link key={item.nome} href={item.href} onClick={() => setMenuAberto(false)} prefetch>
              {item.nome}
            </Link>
          ))}
        </nav>

        <form className="search-shell" onSubmit={buscar}>
          <Search size={18} />
          <input
            aria-label="Buscar produtos"
            placeholder="Buscar produtos, estilos, ideias..."
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </form>

        <div className="header-actions">
          <Link className="icon-btn desktop-only" href="/favoritos" prefetch aria-label="Favoritos">
            <Heart size={20} />
          </Link>
          <Link className="icon-btn" href="/carrinho" prefetch aria-label="Carrinho">
            <ShoppingBag size={20} />
          </Link>
          <Link
            className="icon-btn desktop-only"
            href={usuario ? "/interacoes" : "/login"}
            prefetch
            aria-label="Minha conta"
          >
            <UserRound size={20} />
          </Link>
        </div>
      </header>
    </>
  );
}
