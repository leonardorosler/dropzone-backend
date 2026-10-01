import Link from "next/link";

const promocoes = [
  { imagem: "/home/promo-novidades.webp", href: "/catalogo", titulo: "Novidades da semana" },
  { imagem: "/home/promo-moletons.webp", href: "/catalogo?busca=moletom", titulo: "Moletons" },
  { imagem: "/home/promo-calcas.webp", href: "/catalogo?busca=calça", titulo: "Calças baggy" },
  { imagem: "/home/promo-acessorios.webp", href: "/catalogo?busca=acessório", titulo: "Acessórios" },
];

export function PromocoesHome() {
  return (
    <div className="home-promocoes">
      {promocoes.map((promocao) => (
        <Link
          key={promocao.titulo}
          href={promocao.href}
          className="home-promocao"
          aria-label={promocao.titulo}
          prefetch
        >
          <img src={promocao.imagem} alt="" loading="lazy" />
        </Link>
      ))}
    </div>
  );
}
