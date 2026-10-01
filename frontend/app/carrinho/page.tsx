"use client";

import Link from "next/link";
import { MessageCircle, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { carrinhoApi } from "@/lib/api";
import type { Carrinho } from "@/types/api";

export default function CarrinhoPage() {
  const [carrinho, setCarrinho] = useState<Carrinho | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregarCarrinho() {
    try {
      setCarrinho(await carrinhoApi.listar());
      setErro("");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar carrinho.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCarrinho();
  }, []);

  const total = useMemo(
    () =>
      carrinho?.itens.reduce(
        (soma, item) => soma + Number(item.produtoVariacao.produto.preco) * item.quantidade,
        0
      ) ?? 0,
    [carrinho]
  );

  async function alterarQuantidade(itemId: number, quantidade: number) {
    if (quantidade < 1) return;
    await carrinhoApi.atualizarQuantidade(itemId, quantidade);
    await carregarCarrinho();
  }

  async function removerItem(itemId: number) {
    await carrinhoApi.removerItem(itemId);
    await carregarCarrinho();
  }

  async function finalizarNoWhatsapp() {
    try {
      const pedido = await carrinhoApi.gerarWhatsapp();
      window.open(pedido.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao abrir WhatsApp.");
    }
  }

  const vazio = !carrinho?.itens.length;

  return (
    <>
      <Header />

      <main className="page-shell street-page">
        <header className="page-title street-page-title">
          <span>REVISE SEU PEDIDO</span>
          <h1>CARRINHO</h1>
          <p>Confira as variações e quantidades antes de mandar o pedido.</p>
        </header>

        {carregando ? (
          <div className="street-status">Carregando seu carrinho...</div>
        ) : erro ? (
          <div className="street-empty">
            <ShoppingBag size={28} />
            <strong>Entre para acessar seu carrinho.</strong>
            <p>{erro}</p>
            <Link className="btn street-btn-primary" href="/login">
              ENTRAR NA MINHA CONTA
            </Link>
          </div>
        ) : vazio ? (
          <div className="street-empty">
            <ShoppingBag size={28} />
            <strong>Seu carrinho está vazio.</strong>
            <p>Escolha uma peça, selecione a variação e volte aqui para finalizar.</p>
            <Link className="btn street-btn-primary" href="/catalogo">
              VER CATÁLOGO
            </Link>
          </div>
        ) : (
          <div className="cart-layout street-cart-layout">
            <section className="cart-list street-cart-list">
              {carrinho?.itens.map((item) => (
                <article className="cart-item street-cart-item" key={item.id}>
                  <div className="street-cart-copy">
                    <small>{item.produtoVariacao.produto.categoria?.nome ?? "DROPZONE"}</small>
                    <b>{item.produtoVariacao.produto.nome}</b>
                    <span>
                      {item.produtoVariacao.cor?.nome ?? "Sem cor"} · {item.produtoVariacao.tamanho.nome}
                    </span>
                  </div>

                  <label className="street-quantity">
                    <span>QTD.</span>
                    <input
                      type="number"
                      min={1}
                      value={item.quantidade}
                      onChange={(evento) =>
                        alterarQuantidade(item.id, Number(evento.target.value))
                      }
                    />
                  </label>

                  <strong>
                    R${" "}
                    {(Number(item.produtoVariacao.produto.preco) * item.quantidade).toLocaleString(
                      "pt-BR",
                      { minimumFractionDigits: 2 }
                    )}
                  </strong>

                  <button
                    className="street-remove-button"
                    onClick={() => removerItem(item.id)}
                    aria-label={`Remover ${item.produtoVariacao.produto.nome}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </article>
              ))}
            </section>

            <aside className="cart-summary street-cart-summary">
              <small>RESUMO DO PEDIDO</small>
              <h2>
                R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </h2>
              <p>{carrinho?.itens.length} item(ns) no carrinho.</p>

              <button className="btn whatsapp-btn full" onClick={finalizarNoWhatsapp}>
                <MessageCircle size={17} />
                FINALIZAR PELO WHATSAPP
              </button>

              <small className="street-cart-note">
                A mensagem é montada automaticamente com peça, cor, tamanho, quantidade e preço.
              </small>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
