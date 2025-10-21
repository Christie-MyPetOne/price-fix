"use client";

import React from "react";
import { Flame, TrendingDown, AlertTriangle, Snowflake } from "lucide-react"; // 1. Importando o ícone de floco de neve
import { Product } from "@/lib/types";

export const ProductHealthIcons = ({ product }: { product: Product }) => {
  const alerts = [];

  // Regra 1: "Queimando Caixa" (lucro negativo)
  if (product.totalProfit < 0) {
    alerts.push(
      <div
        key="profit"
        title={`Prejuízo de ${product.totalProfit.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}`}
      >
        <TrendingDown className="w-4 h-4 text-error" />
      </div>
    );
  }

  // Regra 2: "Estoque Baixo" (exemplo: menos de 10 unidades)
  if (product.stockLevel !== undefined && product.stockLevel < 10) {
    alerts.push(
      <div key="stock" title={`Estoque baixo: ${product.stockLevel} unidades`}>
        <AlertTriangle className="w-4 h-4 text-warning" />
      </div>
    );
  }

  // Regra 3: "Estoque Gelado"
  const totalSalesInPeriod =
    product.salesHistory?.reduce((sum, current) => sum + current, 0) ?? 0;
  if (
    product.stockLevel !== undefined &&
    product.stockLevel > 50 &&
    totalSalesInPeriod === 0
  ) {
    alerts.push(
      <div
        key="frozen-stock"
        title="Estoque gelado: Produto com muitas unidades paradas e sem vendas nos últimos 30 dias."
      >
        <Snowflake className="w-4 h-4 text-blue-400" />
      </div>
    );
  }

  // Regra 4: "Oportunidade" (margem alta e boas vendas)
  if (product.margin > 25 && product.sales > 50) {
    alerts.push(
      <div key="opportunity" title="Oportunidade de crescimento!">
        <Flame className="w-4 h-4 text-orange-500" />
      </div>
    );
  }

  // Se não houver alertas, mostra um traço
  if (alerts.length === 0)
    return <span className="text-text-secondary">-</span>;

  return <div className="flex items-center justify-center gap-2">{alerts}</div>;
};
