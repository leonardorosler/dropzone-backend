"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { categoriasApi, produtosApi } from "@/lib/api";
import type { Categoria, Produto } from "@/types/api";

const ITENS_POR_VEZ = 24;

const categoriasPadrao = [
  "Camisetas",
  "Moletons",
  "Calças",
  "Bermudas",
  "Jaquetas",
  "Bonés",
  "Acessórios",
  "Tênis",
  "Bolsas",
  "Croppeds",
];

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function CatalogoConteudo() {
  const searchParams = useSearchParams();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(ITENS_POR_VEZ);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setBusca(searchParams.get("busca") ?? "");

    const categoriaId = searchParams.get("categoriaId");
    setCategoriaSelecionada(categoriaId ? `id:${categoriaId}` : "");
  }, [searchParams]);

  useEffect(() => {
    let ativo = true;

    Promise.all([
      produtosApi.listar({ disponivel: true }),
      categoriasApi.listar(),
    ])
      .then(([listaProdutos, listaCategorias]) => {
        if (!ativo) return;
        setProdutos(listaProdutos);
        setCategorias(listaCategorias);
      })
      .catch((error) => {
        if (!ativo) return;
        setErro(error instanceof Error ? error.message : "Erro ao carregar catálogo.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    setQuantidadeVisivel(ITENS_POR_VEZ);
  }, [busca, categoriaSelecionada]);

  const opcoesCategoria = useMemo(() => {
    if (categorias.length > 0) {
      return categorias.map((categoria) => ({
        valor: `id:${categoria.id}`,
        nome: categoria.nome,
      }));
    }

    return categoriasPadrao.map((nome) => ({
      valor: `nome:${normalizar(nome)}`,
      nome,
    }));
  }, [categorias]);

  const produtosFiltrados = useMemo(() => {
    const termo = normalizar(busca.trim());

    return produtos.filter((produto) => {
      const textoProduto = normalizar(
        `${produto.nome} ${produto.descricao} ${produto.categoria?.nome ?? ""}`
      );

      const bateBusca = !termo || textoProduto.includes(termo);

      if (!categoriaSelecionada) {
        return bateBusca;
      }

      const [tipo, valor] = categoriaSelecionada.split(":");
      const bateCategoria =
        tipo === "id"
          ? produto.categoriaId === Number(valor)
          : normalizar(produto.categoria?.nome ?? "").includes(valor);

      return bateBusca && bateCategoria;
    });
  }, [produtos, busca, categoriaSelecionada]);

  const produtosVisiveis = produtosFiltrados.slice(0, quantidadeVisivel);
  const temMais = quantidadeVisivel < produtosFiltrados.length;

  return (
    <>
      <Header />

      <main className="page-shell catalog-page">
        <div className="page-title catalog-title">
          <span>DROPZONE / CATÁLOGO</span>
          <h1>PEÇAS EM MOVIMENTO</h1>
          <p>Oversized, baggy, heavyweight e utility para montar o look do seu jeito.</p>
        </div>

        <div className="catalog-toolbar">
          <input
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar produtos, estilos, ideias..."
          />

          <select
            value={categoriaSelecionada}
            onChange={(evento) => setCategoriaSelecionada(evento.target.value)}
          >
            <option value="">Todas as categorias</option>
            {opcoesCategoria.map((categoria) => (
              <option key={categoria.valor} value={categoria.valor}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="catalog-meta">
          <span>{produtosFiltrados.length} peças encontradas</span>
          <span>DROPZONE / STREET SYSTEM</span>
        </div>

        {carregando ? (
          <div className="product-grid four catalog-skeleton" aria-label="Carregando catálogo">
            {Array.from({ length: 8 }).map((_, indice) => (
              <div className="skeleton-card" key={indice}>
                <div className="skeleton-media" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            ))}
          </div>
        ) : erro ? (
          <div className="empty-wide error-panel">
            <strong>Não foi possível carregar o catálogo.</strong>
            <span>{erro}</span>
          </div>
        ) : produtosVisiveis.length === 0 ? (
          <div className="empty-wide">Nenhuma peça encontrada com esses filtros.</div>
        ) : (
          <>
            <div className="product-grid four">
              {produtosVisiveis.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>

            {temMais && (
              <div className="load-more-wrap">
                <button
                  className="btn btn-outline load-more"
                  onClick={() => setQuantidadeVisivel((valor) => valor + ITENS_POR_VEZ)}
                >
                  CARREGAR MAIS PEÇAS
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}


export default function CatalogoPage() {
  return (
    <Suspense fallback={<main className="page-shell catalog-page">Carregando catálogo...</main>}>
      <CatalogoConteudo />
    </Suspense>
  );
}
