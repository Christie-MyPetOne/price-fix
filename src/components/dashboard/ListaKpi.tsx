"use client";

import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  Truck,
  Package,
  Tag,
  ShoppingBag,
  TrendingDown,
  MoreHorizontal,
} from "lucide-react";

export default function ListaKpi() {
  const dados = [
    { label: "Custo de mercadoria", valor: "R$ 48.200", variacao: 5.2, icon: Package },
    { label: "Impostos", valor: "R$ 12.500", variacao: -1.8, icon: Percent },
    { label: "Taxa de frete", valor: "R$ 5.800", variacao: 3.6, icon: Truck },
    { label: "Custo de envio", valor: "R$ 3.200", variacao: -2.3, icon: ShoppingBag },
    { label: "Comissão", valor: "R$ 2.900", variacao: 1.1, icon: Tag },
    { label: "Descontos", valor: "R$ 1.750", variacao: -0.5, icon: TrendingDown },
    { label: "Taxa de venda", valor: "R$ 980", variacao: 2.4, icon: DollarSign },
    { label: "Outros custos", valor: "R$ 420", variacao: 0.0, icon: MoreHorizontal },
  ];

  return (
    <div className="rounded-2xl border border-[var(--color-border-dark)] bg-[var(--color-background)] p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dados.map((item) => {
          const Icon = item.icon;
          const aumento = item.variacao > 0;
          const semMudanca = item.variacao === 0;

          const corTexto = semMudanca
            ? "text-[var(--color-text-secondary)]"
            : aumento
            ? "text-[var(--color-error)]"
            : "text-[var(--color-success)]";

          const bgIcone = semMudanca
            ? "bg-[var(--color-border-dark)]/40"
            : aumento
            ? "bg-[var(--color-error)]/10"
            : "bg-[var(--color-success)]/10";

          const bgCard =
            "bg-[var(--color-card)] hover:bg-[rgba(255,255,255,0.85)] dark:hover:bg-[rgba(44,44,44,0.85)]";

          const sombra =
            "shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]";

          return (
            <div
              key={item.label}
              className={`flex flex-col justify-between rounded-xl border border-[var(--color-border-dark)] ${bgCard} ${sombra} transition-all duration-200`}
            >
              {/* Topo: ícone e texto */}
              <div className="flex items-center justify-between px-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${bgIcone}`}>
                    <Icon className={`w-5 h-5 ${corTexto}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {item.label}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {semMudanca
                        ? "Sem variação"
                        : aumento
                        ? "Aumento de custo"
                        : "Redução de custo"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meio: valor */}
              <div className="px-4 py-3">
                <p className="text-base font-semibold text-[var(--color-text)]">
                  {item.valor}
                </p>
              </div>

              {/* Rodapé: chip de variação */}
              <div className="px-4 pb-4">
                <div
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${corTexto} ${
                    semMudanca
                      ? "bg-[var(--color-border-dark)]/60"
                      : aumento
                      ? "bg-[var(--color-error)]/10"
                      : "bg-[var(--color-success)]/10"
                  }`}
                >
                  {semMudanca ? null : aumento ? (
                    <ArrowUpRight size={14} strokeWidth={2.5} />
                  ) : (
                    <ArrowDownRight size={14} strokeWidth={2.5} />
                  )}
                  {aumento ? "+" : ""}
                  {item.variacao.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
