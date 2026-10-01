import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer dropzone-footer">
      <div className="footer-grid">
        <Link href="/" className="footer-logo" aria-label="DropZone - início">
          <img src="/home/logo-dropzone.png" alt="DropZone" />
          <span>STREETWEAR BRASILEIRO</span>
        </Link>

        <div>
          <b>CATEGORIAS</b>
          <Link href="/catalogo">Novidades</Link>
          <Link href="/catalogo?busca=camiseta">Camisetas</Link>
          <Link href="/catalogo?busca=moletom">Moletons</Link>
        </div>

        <div>
          <b>AJUDA</b>
          <Link href="/carrinho">Como comprar</Link>
          <Link href="/login">Minha conta</Link>
        </div>

        <div>
          <b>A DROPZONE</b>
          <span>Streetwear brasileiro.</span>
          <span>Rua. Ideias. Pessoas. Sempre.</span>
        </div>

        <div>
          <b>SIGA A GENTE</b>
          <span>Instagram</span>
          <span>TikTok</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 DropZone. Todos os direitos reservados.</span>
        <span>Termos de uso · Privacidade · Cookies</span>
      </div>
    </footer>
  );
}
