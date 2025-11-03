"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
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
  // 🔹 Dados simulados — cada item agora tem valor e variação percentual
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
  <div className="w-full transition-all duration-300 ease-in-out">
    <Card className="p-6 bg-[var(--color-card)] shadow-sm rounded-xl border border-[var(--color-border-dark)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dados.map((item) => {
          const Icon = item.icon;
          const aumento = item.variacao > 0;
          const semMudanca = item.variacao === 0;

          const cor = semMudanca
            ? "text-[var(--color-text-secondary)]"
            : aumento
            ? "text-[var(--color-error)]"
            : "text-[var(--color-success)]";

          const bgCor = semMudanca
            ? "bg-[var(--color-border-dark)]"
            : aumento
            ? "bg-red-50"
            : "bg-green-50";

          return (
            <div
              key={item.label}
              className="flex items-center justify-between bg-[var(--color-background)] hover:bg-[var(--color-border-dark)] transition-colors rounded-lg p-4 border border-[var(--color-border-dark)] shadow-sm"
            >
              {/* Info principal */}
              <div className="flex items-center gap-3">
                <div className={`p-2 ${bgCor} rounded-md`}>
                  <Icon className={`w-5 h-5 ${cor}`} />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    {item.label}
                  </span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {semMudanca
                      ? "Sem variação"
                      : aumento
                      ? "Aumento de custo"
                      : "Redução de custo"}
                  </span>
                </div>
              </div>

              {/* Valor e variação */}
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {item.valor}
                </span>

                {!semMudanca && (
                  <div className="flex items-center gap-1">
                    {aumento ? (
                      <ArrowUpRight
                        size={16}
                        strokeWidth={2.5}
                        className={cor}
                      />
                    ) : (
                      <ArrowDownRight
                        size={16}
                        strokeWidth={2.5}
                        className={cor}
                      />
                    )}
                    <span className={`text-xs font-semibold ${cor}`}>
                      {aumento ? "+" : ""}
                      {item.variacao.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  </div>
);

}
