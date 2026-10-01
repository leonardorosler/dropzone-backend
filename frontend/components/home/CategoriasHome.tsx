import Link from "next/link";

const categorias = [
  { nome: "Camisetas", busca: "camiseta", imagem: "/home/categoria-camisetas.webp" },
  { nome: "Moletons", busca: "moletom", imagem: "/home/categoria-moletons.webp" },
  { nome: "Calças", busca: "calça", imagem: "/home/categoria-calcas.webp" },
  { nome: "Bermudas", busca: "bermuda", imagem: "/home/categoria-bermudas.webp" },
  { nome: "Jaquetas", busca: "jaqueta", imagem: "/home/categoria-jaquetas.webp" },
  { nome: "Bonés", busca: "boné", imagem: "/home/categoria-bones.webp" },
  { nome: "Acessórios", busca: "acessório", imagem: "/home/categoria-acessorios.webp" },
  { nome: "Tênis", busca: "tênis", imagem: "/home/categoria-tenis.webp" },
  { nome: "Coleções", busca: "drop", imagem: "/home/categoria-colecoes.webp" },
];

export function CategoriasHome() {
  return (
    <section className="home-categorias" aria-label="Categorias DropZone">
      {categorias.map((categoria) => (
        <Link
          key={categoria.nome}
          href={`/catalogo?busca=${encodeURIComponent(categoria.busca)}`}
          className="home-categoria"
          prefetch
        >
          <img src={categoria.imagem} alt="" loading="lazy" />
          <span className="sr-only">{categoria.nome}</span>
        </Link>
      ))}
    </section>
  );
}
