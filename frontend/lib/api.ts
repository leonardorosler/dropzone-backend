import { getToken } from "./auth";
import type {
  Avaliacao,
  Carrinho,
  Categoria,
  Cor,
  DashboardAdmin,
  Favorito,
  InteracoesUsuario,
  LoginResponse,
  PedidoWhatsapp,
  Produto,
  ProdutoVariacao,
  SugestaoIA,
  Tamanho,
  Usuario,
} from "@/types/api";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

type ApiOptions = RequestInit & {
  auth?: boolean;
  cacheTempoMs?: number;
};

type CacheItem = {
  expiraEm: number;
  valor: unknown;
};

// Cache simples em memória para as consultas públicas.
// Evita buscar o mesmo catálogo de novo a cada troca de página no frontend.
const cacheGet = new Map<string, CacheItem>();
const requisicoesEmAndamento = new Map<string, Promise<unknown>>();

function limparCache(prefixo: string) {
  for (const chave of cacheGet.keys()) {
    if (chave.startsWith(prefixo)) {
      cacheGet.delete(chave);
    }
  }
}

async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const metodo = (options.method ?? "GET").toUpperCase();
  const podeUsarCache = metodo === "GET" && !options.auth;
  const cacheTempoMs = options.cacheTempoMs ?? 60_000;
  const chaveCache = path;

  if (podeUsarCache) {
    const cache = cacheGet.get(chaveCache);

    if (cache && cache.expiraEm > Date.now()) {
      return cache.valor as T;
    }

    const requisicaoExistente = requisicoesEmAndamento.get(chaveCache);

    if (requisicaoExistente) {
      return requisicaoExistente as Promise<T>;
    }
  }

  const requisicao = (async () => {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (options.auth) {
      const token = getToken();

      if (!token) {
        throw new Error("Faça login para continuar.");
      }

      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");
    const payload = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const mensagem =
        typeof payload === "object" && payload
          ? payload.mensagem ?? payload.message ?? "Erro na requisição."
          : String(payload || "Erro na requisição.");

      throw new Error(mensagem);
    }

    if (podeUsarCache) {
      cacheGet.set(chaveCache, {
        valor: payload,
        expiraEm: Date.now() + cacheTempoMs,
      });
    }

    return payload as T;
  })();

  if (podeUsarCache) {
    requisicoesEmAndamento.set(chaveCache, requisicao);
  }

  try {
    return await requisicao;
  } finally {
    requisicoesEmAndamento.delete(chaveCache);
  }
}

export const authApi = {
  login: (email: string, senha: string) =>
    api<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    }),
};

export const usuariosApi = {
  cadastrar: (data: { nome: string; email: string; senha: string }) =>
    api<Usuario>("/usuarios", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  meuPerfil: () => api<Usuario>("/usuarios/me", { auth: true }),

  minhasInteracoes: () =>
    api<InteracoesUsuario>("/usuarios/me/interacoes", { auth: true }),
};

export const categoriasApi = {
  listar: () => api<Categoria[]>("/categorias", { cacheTempoMs: 120_000 }),

  criar: async (nome: string) => {
    const categoria = await api<Categoria>("/categorias", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ nome }),
    });

    limparCache("/categorias");
    return categoria;
  },

  atualizar: async (id: number, nome: string) => {
    const categoria = await api<Categoria>(`/categorias/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify({ nome }),
    });

    limparCache("/categorias");
    return categoria;
  },

  deletar: async (id: number) => {
    const categoria = await api<Categoria>(`/categorias/${id}`, {
      method: "DELETE",
      auth: true,
    });

    limparCache("/categorias");
    limparCache("/produtos");
    return categoria;
  },
};

export const coresApi = {
  listar: () => api<Cor[]>("/cores", { cacheTempoMs: 120_000 }),
  buscar: (id: number) => api<Cor>(`/cores/${id}`),

  criar: (data: { nome: string; hex?: string }) =>
    api<Cor>("/cores", {
      method: "POST",
      auth: true,
      body: JSON.stringify(data),
    }),

  atualizar: (id: number, data: { nome: string; hex?: string }) =>
    api<Cor>(`/cores/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(data),
    }),

  deletar: (id: number) =>
    api<Cor>(`/cores/${id}`, {
      method: "DELETE",
      auth: true,
    }),
};

export const tamanhosApi = {
  listar: () => api<Tamanho[]>("/tamanhos", { cacheTempoMs: 120_000 }),
  buscar: (id: number) => api<Tamanho>(`/tamanhos/${id}`),

  criar: (nome: string) =>
    api<Tamanho>("/tamanhos", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ nome }),
    }),

  atualizar: (id: number, nome: string) =>
    api<Tamanho>(`/tamanhos/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify({ nome }),
    }),

  deletar: (id: number) =>
    api<Tamanho>(`/tamanhos/${id}`, {
      method: "DELETE",
      auth: true,
    }),
};

export const produtosApi = {
  listar: (filtros?: {
    busca?: string;
    categoriaId?: number;
    disponivel?: boolean;
    destaque?: boolean;
  }) => {
    const params = new URLSearchParams();

    if (filtros?.busca) params.set("busca", filtros.busca);
    if (filtros?.categoriaId)
      params.set("categoriaId", String(filtros.categoriaId));
    if (typeof filtros?.disponivel === "boolean")
      params.set("disponivel", String(filtros.disponivel));
    if (typeof filtros?.destaque === "boolean")
      params.set("destaque", String(filtros.destaque));

    const query = params.toString();

    return api<Produto[]>(`/produtos${query ? `?${query}` : ""}`, {
      cacheTempoMs: 60_000,
    });
  },

  buscar: (id: number) =>
    api<Produto>(`/produtos/${id}`, { cacheTempoMs: 60_000 }),

  criar: async (data: {
    nome: string;
    descricao: string;
    preco: number;
    categoriaId: number;
    destaque?: boolean;
    imagemUrl?: string;
  }) => {
    const produto = await api<Produto>("/produtos", {
      method: "POST",
      auth: true,
      body: JSON.stringify(data),
    });

    limparCache("/produtos");
    return produto;
  },

  atualizar: async (
    id: number,
    data: {
      nome: string;
      descricao: string;
      preco: number;
      categoriaId: number;
      disponivel?: boolean;
      destaque?: boolean;
    }
  ) => {
    const produto = await api<Produto>(`/produtos/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(data),
    });

    limparCache("/produtos");
    return produto;
  },

  atualizarDisponibilidade: async (id: number, disponivel: boolean) => {
    const produto = await api<Produto>(`/produtos/${id}/disponibilidade`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ disponivel }),
    });

    limparCache("/produtos");
    return produto;
  },

  deletar: async (id: number) => {
    const produto = await api<Produto>(`/produtos/${id}`, {
      method: "DELETE",
      auth: true,
    });

    limparCache("/produtos");
    return produto;
  },

  listarVariacoes: (produtoId: number) =>
    api<ProdutoVariacao[]>(`/produtos/${produtoId}/variacoes`),

  criarVariacao: (
    produtoId: number,
    data: { corId?: number; tamanhoId: number; disponivel?: boolean }
  ) =>
    api<ProdutoVariacao>(`/produtos/${produtoId}/variacoes`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(data),
    }),

  atualizarDisponibilidadeVariacao: (id: number, disponivel: boolean) =>
    api<ProdutoVariacao>(`/produtos/variacoes/${id}/disponibilidade`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ disponivel }),
    }),
};

export const favoritosApi = {
  listar: () => api<Favorito[]>("/favoritos", { auth: true }),

  adicionar: (produtoId: number) =>
    api<Favorito>(`/favoritos/${produtoId}`, {
      method: "POST",
      auth: true,
    }),

  remover: (produtoId: number) =>
    api<Favorito>(`/favoritos/${produtoId}`, {
      method: "DELETE",
      auth: true,
    }),
};

export const avaliacoesApi = {
  listarProduto: (produtoId: number) =>
    api<Avaliacao[]>(`/avaliacoes/produtos/${produtoId}`),

  criar: (produtoId: number, data: { nota: number; comentario?: string }) =>
    api<Avaliacao>(`/avaliacoes/produtos/${produtoId}`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(data),
    }),

  atualizar: (
    produtoId: number,
    data: { nota: number; comentario?: string }
  ) =>
    api<Avaliacao>(`/avaliacoes/produtos/${produtoId}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(data),
    }),

  deletar: (produtoId: number) =>
    api<Avaliacao>(`/avaliacoes/produtos/${produtoId}`, {
      method: "DELETE",
      auth: true,
    }),
};

export const carrinhoApi = {
  listar: () => api<Carrinho>("/carrinho", { auth: true }),

  adicionarItem: (produtoVariacaoId: number, quantidade: number) =>
    api("/carrinho/itens", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ produtoVariacaoId, quantidade }),
    }),

  atualizarQuantidade: (itemId: number, quantidade: number) =>
    api(`/carrinho/itens/${itemId}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ quantidade }),
    }),

  removerItem: (itemId: number) =>
    api(`/carrinho/itens/${itemId}`, {
      method: "DELETE",
      auth: true,
    }),

  gerarWhatsapp: () =>
    api<PedidoWhatsapp>("/carrinho/whatsapp", {
      method: "POST",
      auth: true,
    }),
};

export const adminApi = {
  dashboard: () => api<DashboardAdmin>("/admin/dashboard", { auth: true }),
  avaliacoes: () => api<Avaliacao[]>("/admin/avaliacoes", { auth: true }),

  responderAvaliacao: (id: number, respostaAdmin: string) =>
    api<Avaliacao>(`/admin/avaliacoes/${id}/resposta`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ respostaAdmin }),
    }),

  excluirAvaliacao: (id: number) =>
    api<Avaliacao>(`/admin/avaliacoes/${id}`, {
      method: "DELETE",
      auth: true,
    }),

  favoritos: () => api<Favorito[]>("/admin/favoritos", { auth: true }),
  pedidos: () => api<Carrinho[]>("/admin/pedidos", { auth: true }),
};

export const iaApi = {
  sugerirLook: (produtoId: number) =>
    api<SugestaoIA>("/ia/sugestao-look", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ produtoId }),
    }),
};

export const variacoesApi = {
  listarPorProduto: (produtoId: number) =>
    api<ProdutoVariacao[]>(`/variacoes/produto/${produtoId}`),

  buscar: (id: number) => api<ProdutoVariacao>(`/variacoes/${id}`),

  criar: (data: {
    produtoId: number;
    corId?: number;
    tamanhoId: number;
    disponivel?: boolean;
  }) =>
    api<ProdutoVariacao>("/variacoes", {
      method: "POST",
      auth: true,
      body: JSON.stringify(data),
    }),

  atualizar: (
    id: number,
    data: {
      produtoId: number;
      corId?: number;
      tamanhoId: number;
      disponivel?: boolean;
    }
  ) =>
    api<ProdutoVariacao>(`/variacoes/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(data),
    }),

  deletar: (id: number) =>
    api<ProdutoVariacao>(`/variacoes/${id}`, {
      method: "DELETE",
      auth: true,
    }),
};
