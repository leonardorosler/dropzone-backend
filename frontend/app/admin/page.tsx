"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminApi } from "@/lib/api";
import type { DashboardAdmin } from "@/types/api";

export default function AdminDashboardPage() {
  const [dados, setDados] = useState<DashboardAdmin | null>(null);

  useEffect(() => {
    adminApi.dashboard().then(setDados);
  }, []);

  if (!dados) {
    return <div className="admin-loading-inline">Carregando dashboard...</div>;
  }

  const metricas = [
    ["Produtos", dados.totais.produtos],
    ["Clientes", dados.totais.clientes],
    ["Avaliações", dados.totais.avaliacoes],
    ["Favoritos", dados.totais.favoritos],
    ["Pedidos finalizados", dados.totais.pedidosFinalizados],
  ];

  return (
    <>
      <div className="admin-heading">
        <small>VISÃO GERAL / DROPZONE</small>
        <h1>DASHBOARD</h1>
      </div>

      <div className="metric-grid">
        {metricas.map(([label, value]) => (
          <article key={String(label)}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="chart-card">
          <h2>Produtos mais favoritados</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.produtosMaisFavoritados}>
              <CartesianGrid stroke="#303331" strokeDasharray="3 3" />
              <XAxis dataKey="nome" tick={{ fill: "#aeb1ad", fontSize: 10 }} />
              <YAxis tick={{ fill: "#aeb1ad", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#101211",
                  border: "1px solid #3b3e3b",
                  color: "#f6f6f2",
                }}
              />
              <Bar dataKey="totalFavoritos" fill="#f04a1f" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="chart-card">
          <h2>Produtos melhor avaliados</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.produtosMelhorAvaliados}>
              <CartesianGrid stroke="#303331" strokeDasharray="3 3" />
              <XAxis dataKey="nome" tick={{ fill: "#aeb1ad", fontSize: 10 }} />
              <YAxis domain={[0, 5]} tick={{ fill: "#aeb1ad", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#101211",
                  border: "1px solid #3b3e3b",
                  color: "#f6f6f2",
                }}
              />
              <Bar dataKey="mediaAvaliacao" fill="#f04a1f" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </>
  );
}
