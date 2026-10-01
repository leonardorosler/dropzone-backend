"use client";

import Link from "next/link";
import { ArrowRight, LoaderCircle, Sparkles, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { iaApi } from "@/lib/api";
import type { Produto, SugestaoIA } from "@/types/api";

interface LookIaHomeProps {
  produtos: Produto[];
}

export function LookIaHome({ produtos }: LookIaHomeProps) {
  const router = useRouter();
  const { usuario } = useAuth();
  const [preferencia, setPreferencia] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<SugestaoIA | null>(null);
  const [erro, setErro] = useState("");

  const produtoBase = useMemo(() => {
    const termo = preferencia.trim().toLowerCase();

    if (!termo) {
      return produtos.find((produto) => produto.destaque) ?? produtos[0];
    }

    return (
      produtos.find((produto) => {
        const texto = `${produto.nome} ${produto.descricao} ${produto.categoria?.nome ?? ""}`.toLowerCase();
        return termo.split(/\s+/).some((palavra) => palavra.length > 2 && texto.includes(palavra));
      }) ??
      produtos.find((produto) => produto.destaque) ??
      produtos[0]
    );
  }, [preferencia, produtos]);

  async function criarLook(evento: FormEvent) {
    evento.preventDefault();
    setErro("");

    if (!usuario) {
      router.push("/login");
      return;
    }

    if (!produtoBase) {
      setErro("O catálogo ainda não tem produtos disponíveis para a sugestão.");
      return;
    }

    try {
      setCarregando(true);
      setResultado(await iaApi.sugerirLook(produtoBase.id));
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível criar o look agora.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="look-ia-home" id="looks-ia">
      <div className="look-ia-conteudo">
        <small><Sparkles size={14} /> DROPZONE · IA</small>
        <h2>MONTE SEU<br /><strong>LOOK COM IA</strong></h2>
        <p>Digite uma ideia de estilo. A IA usa peças reais do catálogo para sugerir uma combinação.</p>

        <form className="look-ia-form" onSubmit={criarLook}>
          <input
            value={preferencia}
            onChange={(evento) => setPreferencia(evento.target.value)}
            placeholder="Ex: baggy, preto, casual..."
            aria-label="Preferência para o look"
          />
          <button type="submit" aria-label="Criar look" disabled={carregando}>
            {carregando ? <LoaderCircle className="girando" size={21} /> : <ArrowRight size={21} />}
          </button>
        </form>

        {erro && <p className="look-ia-erro">{erro}</p>}
      </div>

      <div className="look-ia-visual" aria-hidden="true">
        <img src="/home/ia-look-visual.webp" alt="" loading="lazy" />
      </div>

      {resultado && (
        <div className="look-ia-resultado" role="status">
          <button onClick={() => setResultado(null)} aria-label="Fechar sugestão"><X size={18} /></button>
          <small>GERADO POR IA · {resultado.fonte ?? "Google Gemini"}</small>
          <strong>{resultado.produtoBase?.nome ?? produtoBase?.nome}</strong>
          {resultado.explicacao && <p>{resultado.explicacao}</p>}
          <div>
            {resultado.sugestoes?.map((sugestao) => (
              <Link key={sugestao.produtoId} href={`/produtos/${sugestao.produtoId}`}>
                <b>{sugestao.nome}</b>
                <span>{sugestao.motivo}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
