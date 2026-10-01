"use client";

import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { avaliacoesApi, carrinhoApi, iaApi, produtosApi } from "@/lib/api";
import type { Avaliacao, Produto, SugestaoIA } from "@/types/api";

export default function ProdutoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { usuario } = useAuth();
  const produtoId = Number(params.id);

  const [produto, setProduto] = useState<Produto | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [variacaoId, setVariacaoId] = useState<number | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [sugestao, setSugestao] = useState<SugestaoIA | null>(null);
  const [carregandoIa, setCarregandoIa] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([
      produtosApi.buscar(produtoId),
      avaliacoesApi.listarProduto(produtoId),
    ])
      .then(([produtoCarregado, avaliacoesCarregadas]) => {
        setProduto(produtoCarregado);
        setAvaliacoes(avaliacoesCarregadas);
        setVariacaoId(
          produtoCarregado.variacoes?.find((variacao) => variacao.disponivel)?.id ?? null
        );
      })
      .catch((error) => {
        setErro(error instanceof Error ? error.message : "Erro ao carregar produto.");
      });
  }, [produtoId]);

  const media = useMemo(() => {
    if (!avaliacoes.length) return 0;
    return avaliacoes.reduce((soma, avaliacao) => soma + avaliacao.nota, 0) / avaliacoes.length;
  }, [avaliacoes]);

  async function adicionarAoCarrinho() {
    if (!usuario) {
      router.push("/login");
      return;
    }

    if (!variacaoId) {
      alert("Selecione uma variação disponível.");
      return;
    }

    await carrinhoApi.adicionarItem(variacaoId, quantidade);
    router.push("/carrinho");
  }

  async function avaliar() {
    if (!usuario) {
      router.push("/login");
      return;
    }

    try {
      await avaliacoesApi.criar(produtoId, { nota, comentario });
      setAvaliacoes(await avaliacoesApi.listarProduto(produtoId));
      setComentario("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao avaliar.");
    }
  }

  async function pedirSugestao() {
    if (!usuario) {
      router.push("/login");
      return;
    }

    setCarregandoIa(true);

    try {
      setSugestao(await iaApi.sugerirLook(produtoId));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao gerar sugestão.");
    } finally {
      setCarregandoIa(false);
    }
  }

  if (erro) {
    return (
      <>
        <Header />
        <main className="page-shell street-page">
          <div className="street-empty">
            <strong>Não foi possível abrir esta peça.</strong>
            <p>{erro}</p>
            <Link className="btn street-btn-primary" href="/catalogo">
              VOLTAR AO CATÁLOGO
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!produto) {
    return (
      <>
        <Header />
        <main className="page-shell street-page">
          <div className="street-status">Carregando peça...</div>
        </main>
      </>
    );
  }

  const imagem =
    produto.imagens?.[0]?.imagemUrl ??
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=82";

  return (
    <>
      <Header />

      <main className="page-shell street-page product-page">
        <div className="product-detail street-product-detail">
          <div className="detail-image street-detail-image">
            <img src={imagem} alt={produto.nome} />
            <span className="street-product-tag">DROPZONE / STREET SYSTEM</span>
          </div>

          <div className="detail-copy street-detail-copy">
            <small>{produto.categoria?.nome ?? "DROPZONE"}</small>
            <h1>{produto.nome}</h1>

            <div className="street-rating">
              <Star size={16} fill="currentColor" />
              <span>{media.toFixed(1)}</span>
              <small>{avaliacoes.length} avaliação(ões)</small>
            </div>

            <p>{produto.descricao}</p>

            <strong className="detail-price">
              R$ {Number(produto.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </strong>

            <div className="street-product-fields">
              <label>
                VARIAÇÃO
                <select
                  value={variacaoId ?? ""}
                  onChange={(evento) => setVariacaoId(Number(evento.target.value))}
                >
                  {produto.variacoes?.map((variacao) => (
                    <option
                      key={variacao.id}
                      value={variacao.id}
                      disabled={!variacao.disponivel}
                    >
                      {variacao.cor?.nome ?? "Sem cor"} · {variacao.tamanho?.nome ?? "Sem tamanho"}
                      {!variacao.disponivel ? " · indisponível" : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                QUANTIDADE
                <input
                  type="number"
                  min={1}
                  value={quantidade}
                  onChange={(evento) => setQuantidade(Number(evento.target.value))}
                />
              </label>
            </div>

            <button className="btn street-btn-primary full" onClick={adicionarAoCarrinho}>
              ADICIONAR AO CARRINHO
            </button>

            <button className="btn street-btn-outline full" onClick={pedirSugestao}>
              <Sparkles size={16} />
              {carregandoIa ? "CRIANDO LOOK..." : "CRIAR COMBINAÇÃO COM IA"}
            </button>

            {sugestao && (
              <div className="ai-result street-ai-result">
                <small>GERADO POR IA · {sugestao.fonte ?? "Google Gemini"}</small>
                <p>{sugestao.explicacao}</p>

                {sugestao.sugestoes?.map((item) => (
                  <Link href={`/produtos/${item.produtoId}`} key={item.produtoId}>
                    <b>{item.nome}</b>
                    <span>{item.motivo}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <section className="reviews street-reviews">
          <div className="street-section-heading">
            <span>COMUNIDADE</span>
            <h2>AVALIAÇÕES</h2>
          </div>

          {usuario ? (
            <div className="review-form street-review-form">
              <select value={nota} onChange={(evento) => setNota(Number(evento.target.value))}>
                {[5, 4, 3, 2, 1].map((valor) => (
                  <option key={valor} value={valor}>
                    {valor} estrela{valor > 1 ? "s" : ""}
                  </option>
                ))}
              </select>

              <textarea
                value={comentario}
                onChange={(evento) => setComentario(evento.target.value)}
                placeholder="Conte o que achou da peça..."
              />

              <button className="btn street-btn-primary" onClick={avaliar}>
                ENVIAR AVALIAÇÃO
              </button>
            </div>
          ) : (
            <p className="street-login-hint">
              <Link href="/login">Entre na sua conta</Link> para avaliar esta peça.
            </p>
          )}

          <div className="review-list street-review-list">
            {avaliacoes.map((avaliacao) => (
              <article key={avaliacao.id}>
                <b>★ {avaliacao.nota}</b>
                <p>{avaliacao.comentario}</p>

                {avaliacao.respostaAdmin && (
                  <div className="admin-reply">
                    <strong>Resposta da DropZone</strong>
                    <p>{avaliacao.respostaAdmin}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
