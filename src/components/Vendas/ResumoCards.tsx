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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <Card>
        <h1 className="font-bold text-2xl">Faturamento</h1>
        <p className="mt-4 text-xl">
          R$
          {sales
            .reduce((acc, s) => acc + (s.financials?.valor_faturado ?? 0), 0)
            .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </Card>
      <Card>
        <h1 className="font-bold text-2xl">Margem média</h1>
        <p className="mt-4 text-xl">
          {(() => {
            const totalFaturado = sales.reduce(
              (acc, s) => acc + (s.financials?.valor_faturado ?? 0),
              0
            );
            const totalCusto = sales.reduce(
              (acc, s) =>
                acc +
                (s.items?.reduce((a, it) => a + (it.totalCost ?? 0), 0) ?? 0),
              0
            );
            const margemMedia =
              totalFaturado > 0
                ? ((totalFaturado - totalCusto) / totalFaturado) * 100
                : 0;
            return `${margemMedia.toFixed(2)}%`;
          })()}
        </p>
      </Card>
      <Card>
        <h1 className="font-bold text-2xl">Pedidos Realizados</h1>
        <p className="mt-4 text-xl">{sales.length.toLocaleString("pt-BR")}</p>
      </Card>
    </div>
  );
}
