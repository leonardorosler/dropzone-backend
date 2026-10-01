# DropZone Frontend

Frontend em Next.js + React + TypeScript, separado do backend e inspirado no Frame 1 do Figma.

## Rodar

```bash
npm install
npm run typecheck
npm run dev
```

Acesse `http://localhost:3000`.

## Integração

A URL da API fica em `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

A camada central de comunicação está em `lib/api.ts` e contém auth, usuários, categorias, cores, tamanhos, produtos, variações, favoritos, avaliações, carrinho, WhatsApp, admin e IA.

## Telas

- Home
- Catálogo
- Detalhe de produto
- Login
- Cadastro
- Favoritos
- Carrinho
- Minhas interações
- Dashboard admin
- Produtos admin
- Categorias admin
- Cores admin
- Tamanhos admin
- Interações admin
