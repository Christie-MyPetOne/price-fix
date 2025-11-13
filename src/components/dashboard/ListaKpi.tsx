"use client";

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
import { useDashboardStore } from "@/store/useDashboardStore";

export default function ListaKpi({ mode }: { mode: "reais" | "percentual" }) {
  const dados = useDashboardStore(
    (state: any) => state.dashboardData?.listaKpi
  );

  const iconMap: { [key: string]: React.ElementType } = {
    "Custo de mercadoria": Package,
    Impostos: Percent,
    "Taxa de frete": Truck,
    "Custo de envio": ShoppingBag,
    Comissão: Tag,
    Descontos: TrendingDown,
    "Taxa de venda": DollarSign,
    "Outros custos": MoreHorizontal,
  };

  if (!dados) {
    return (
      <div className="w-full text-center text-gray-500">
        Carregando lista de KPIs...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dados.map((item: any) => {
          const Icon = iconMap[item.label] || MoreHorizontal;
          const up = item.variacao > 0;
          const flat = item.variacao === 0;

          const tone = flat
            ? "text-[var(--color-text-secondary)]"
            : up
            ? "text-[var(--color-error)]"
            : "text-[var(--color-success)]";

          const numeric = parseFloat(item.valor.replace(/[^\d.-]/g, ""));
          const valorExibido =
            mode === "reais" ? item.valor : `${(numeric / 1000).toFixed(2)}%`;

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
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${tone}`} strokeWidth={2} />
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text)] leading-none">
                    {item.label}
                  </h4>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {flat
                      ? "Sem variação"
                      : up
                      ? "Aumento de custo"
                      : "Redução de custo"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-baseline justify-between">
                <p className="text-[26px] font-semibold tracking-tight text-[var(--color-text)]">
                  {valorExibido}
                </p>

                <div className={`flex items-center gap-1 ${tone}`}>
                  {flat ? null : up ? (
                    <ArrowUpRight size={18} strokeWidth={2.5} />
                  ) : (
                    <ArrowDownRight size={18} strokeWidth={2.5} />
                  )}

                  <span className="text-sm font-semibold">
                    {flat
                      ? "0%"
                      : `${up ? "+" : ""}${item.variacao.toFixed(1)}%`}
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
