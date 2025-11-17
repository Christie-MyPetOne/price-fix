"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Sale } from "@/lib/types";

interface ResumoCardsProps {
  sales: Sale[];
}

export default function ResumoCards({ sales }: ResumoCardsProps) {
  const totalFaturado = sales.reduce(
    (acc, s) => acc + (s.financials?.valor_faturado ?? 0),
    0
  );

  const totalCusto = sales.reduce(
    (acc, s) =>
      acc + (s.items?.reduce((a, it) => a + (it.totalCost ?? 0), 0) ?? 0),
    0
  );

  const margemMedia =
    totalFaturado > 0
      ? ((totalFaturado - totalCusto) / totalFaturado) * 100
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
      <Card className="bg-card p-4 sm:p-6">
        <h1 className="font-bold text-xl sm:text-2xl">Faturamento</h1>
        <p className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold">
          R$
          {totalFaturado.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </p>
      </Card>

      <Card className="bg-card p-4 sm:p-6">
        <h1 className="font-bold text-xl sm:text-2xl">Margem média</h1>
        <p className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold">
          {margemMedia.toFixed(2)}%
        </p>
      </Card>

      <Card className="bg-card p-4 sm:p-6">
        <h1 className="font-bold text-xl sm:text-2xl">Pedidos Realizados</h1>
        <p className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold">
          {sales.length.toLocaleString("pt-BR")}
        </p>
      </Card>
    </div>
  );
}
