import Link from "next/link";
export function AdminNav(){
  return <aside className="admin-nav">
    <Link href="/admin" className="brand admin-brand"><strong>DROPZONE</strong><small>ADMIN</small></Link>
    <nav>
      <Link href="/admin">Dashboard</Link>
      <Link href="/admin/produtos">Produtos</Link>
      <Link href="/admin/categorias">Categorias</Link>
      <Link href="/admin/cores">Cores</Link>
      <Link href="/admin/tamanhos">Tamanhos</Link>
      <Link href="/admin/interacoes">Interações</Link>
      <Link href="/">Voltar para a loja</Link>
    </nav>
  </aside>;
}
