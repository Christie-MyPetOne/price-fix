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



type KPI = {
  label: string;
  valor: string;
  variacao: number;
  icon:
    | typeof Package
    | typeof Percent
    | typeof Truck
    | typeof ShoppingBag
    | typeof Tag
    | typeof TrendingDown
    | typeof DollarSign
    | typeof MoreHorizontal;
};

const dados: KPI[] = [
  { label: "Custo de mercadoria", valor: "R$ 48.200", variacao: 5.2, icon: Package },
  { label: "Impostos", valor: "R$ 12.500", variacao: -1.8, icon: Percent },
  { label: "Taxa de frete", valor: "R$ 5.800", variacao: 3.6, icon: Truck },
  { label: "Custo de envio", valor: "R$ 3.200", variacao: -2.3, icon: ShoppingBag },
  { label: "Comissão", valor: "R$ 2.900", variacao: 1.1, icon: Tag },
  { label: "Descontos", valor: "R$ 1.750", variacao: -0.5, icon: TrendingDown },
  { label: "Taxa de venda", valor: "R$ 980", variacao: 2.4, icon: DollarSign },
  { label: "Outros custos", valor: "R$ 420", variacao: 0.0, icon: MoreHorizontal },
];

export default function ListaKpi({ mode }: { mode: "reais" | "percentual" }) {

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dados.map((item) => {
          const Icon = item.icon;
          const up = item.variacao > 0;
          const flat = item.variacao === 0;

          const tone =
            flat
              ? "text-[var(--color-text-secondary)]"
              : up
              ? "text-[var(--color-error)]"
              : "text-[var(--color-success)]";

          // ✅ Conversão de reais → percentual
          const numeric = parseFloat(item.valor.replace(/[^\d.-]/g, ""));
          const valorExibido =
            mode === "reais"
              ? item.valor
              : `${(numeric / 1000).toFixed(2)}%`;

          return (
            <article
              key={item.label}
              className="
                rounded-[18px]
                bg-[var(--color-card)]
                border border-[var(--color-border-dark)]
                shadow-[0_6px_16px_rgba(0,0,0,0.06)]
                hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)]
                transition-shadow
                p-5
              "
            >
              {/* TOPO */}
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${tone}`} strokeWidth={2} />
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text)] leading-none">
                    {item.label}
                  </h4>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {flat ? "Sem variação" : up ? "Aumento de custo" : "Redução de custo"}
                  </p>
                </div>
              </div>

              {/* BASE */}
              <div className="mt-6 flex items-baseline justify-between">
                <p className="text-[26px] font-semibold tracking-tight text-[var(--color-text)]">
                  {valorExibido} {/* ✅ Atualizado dinamicamente */}
                </p>

                <div className={`flex items-center gap-1 ${tone}`}>
                  {flat ? null : up ? (
                    <ArrowUpRight size={18} strokeWidth={2.5} />
                  ) : (
                    <ArrowDownRight size={18} strokeWidth={2.5} />
                  )}

                  <span className="text-sm font-semibold">
                    {flat ? "0%" : `${up ? "+" : ""}${item.variacao.toFixed(1)}%`}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
