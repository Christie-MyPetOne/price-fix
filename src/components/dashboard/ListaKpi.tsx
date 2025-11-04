"use client";

import React from "react";
import { Card } from "@/components/ui/Card"; // mantém seu Card
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

/**
 * Melhorias aplicadas:
 * - Tipografia consistente (tamanhos e pesos uniformes)
 * - Alinhamento vertical/horizontal mais "encaixado"
 * - Uso disciplinado de verde (queda de custo) e vermelho (aumento de custo)
 * - Badges de status com contraste adequado
 * - Espaçamento responsivo e cartões com mesma altura
 * - Hovers sutis e foco acessível
 */

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
    <div className="w-full transition-all duration-300 ease-in-out">
      <Card className="p-5 sm:p-6 bg-[var(--color-card)] shadow-sm rounded-2xl border border-[var(--color-border-dark)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {dados.map((item) => {
            const Icon = item.icon;
            const aumento = item.variacao > 0;
            const semMudanca = item.variacao === 0;

            // Cores centralizadas nos tokens existentes do seu tema
            const corTexto = semMudanca
              ? "text-[var(--color-text-secondary)]"
              : aumento
              ? "text-[var(--color-error)]"
              : "text-[var(--color-success)]";

            const corBgBadge = semMudanca
              ? "bg-[var(--color-border-dark)]"
              : aumento
              ? "bg-[color:rgb(254_242_242)]" /* red-50 */
              : "bg-[color:rgb(240_253_244)]" /* green-50 */;

            const corRingIcon = semMudanca
              ? "ring-[var(--color-border-dark)]"
              : aumento
              ? "ring-[color:rgb(254_202_202)]" /* red-200 */
              : "ring-[color:rgb(187_247_208)]" /* green-200 */;

            return (
              <div
                key={item.label}
                className="group flex min-h-[92px] items-center justify-between rounded-xl p-4 border border-[var(--color-border-dark)] bg-[var(--color-background)] shadow-sm hover:shadow transition-shadow focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-offset-0"
                role="region"
                aria-label={item.label}
              >
                {/* Bloco esquerdo: Ícone + Títulos */}
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${corBgBadge} ring-1 ${corRingIcon}`}
                  >
                    <Icon className={`h-5 w-5 ${corTexto}`} />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-[13px] sm:text-sm font-medium text-[var(--color-text)]">
                      {item.label}
                    </span>
                    <span className={`text-[11px] sm:text-xs ${semMudanca ? "text-[var(--color-text-secondary)]" : corTexto}`}>
                      {semMudanca
                        ? "Sem variação"
                        : aumento
                        ? "Aumento de custo"
                        : "Redução de custo"}
                    </span>
                  </div>
                </div>

                {/* Bloco direito: Valor + Variação */}
                <div className="flex flex-col items-end text-right gap-1 min-w-[120px]">
                  <span className="text-sm sm:text-[15px] font-semibold leading-none text-[var(--color-text)]">
                    {item.valor}
                  </span>

                  {semMudanca ? (
                    <span className="text-[11px] sm:text-xs text-[var(--color-text-secondary)]">0,0%</span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-[10px] px-2 py-1 text-[11px] sm:text-xs font-semibold ${corTexto} ${corBgBadge}`}
                    >
                      {aumento ? (
                        <ArrowUpRight size={14} strokeWidth={2.4} className={corTexto} />
                      ) : (
                        <ArrowDownRight size={14} strokeWidth={2.4} className={corTexto} />
                      )}
                      {aumento ? "+" : ""}
                      {item.variacao.toFixed(1)}%
                    </span>
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
