// components/analytics/MargensChart.tsx
"use client";
import React, { useMemo, useState } from "react";

type Bucket = {
  id: string;
  titulo: string;
  orders: number;
  percent: number;
  lucro: number;
  color?: string;     // se ainda usa tailwind
  barColor?: string;  // se ainda usa tailwind
  barHex?: string;    // ✅ NOVO: cor da barra em hex (inline)
  initiallyChecked?: boolean;
};

type LegendItem = {
  label: string;           // "Alta"
  range: string;           // "> 20,00%"
};

interface MargensChartProps {
  buckets: Bucket[];
  legend: LegendItem[];
  onChangeSelection?: (selectedIds: string[]) => void;
  onEditRanges?: () => void;
}

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function MargensChart({
  buckets,
  legend,
  onChangeSelection,
  onEditRanges,
}: MargensChartProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    () =>
      buckets.reduce((acc, b) => {
        acc[b.id] = b.initiallyChecked ?? true;
        return acc;
      }, {} as Record<string, boolean>)
  );

  const maxOrders = useMemo(
    () => Math.max(...buckets.map((b) => b.orders), 1),
    [buckets]
  );

  const selectedIds = useMemo(
    () => Object.entries(checked).filter(([, v]) => v).map(([k]) => k),
    [checked]
  );

  // Avisar quem usa o componente quando mudar seleção
  React.useEffect(() => {
    onChangeSelection?.(selectedIds);
  }, [selectedIds, onChangeSelection]);

  return (
    <div className="w-full bg-card rounded-lg shadow-sm border border-border-dark p-3 sm:p-4">
      <div className="flex gap-6">
        {/* Área principal */}
        <div className="flex-1">
          {/* Topo: contadores */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pb-2">
            {buckets.map((b) => (
              <div key={b.id} className="text-xs sm:text-sm text-color-text">
                <span className="font-semibold">
                  {b.orders.toLocaleString("pt-BR")} pedidos
                </span>{" "}
                <span className="text-color-text">
                  {b.percent.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                </span>
              </div>
            ))}
          </div>

          {/* Linha separadora + minigráfico de barras */}
          {/* Linha + mini-barras: mesma grade das colunas de cima */}
          <div className="relative h-14 mb-3">
          

            <div
              className="grid h-full gap-4"
              style={{ gridTemplateColumns: `repeat(${buckets.length}, minmax(0,1fr))` }}
            >
              {buckets.map((b) => {
                const h = Math.max(8, Math.round((b.orders / maxOrders) * 56)); // 8..56px
                const hex =
                  b.barHex ??
                  (
                    {
                      alta: "#1d4ed8",        // azul
                      media: "#059669",       // verde
                      baixa: "#f59e0b",       // amarelo
                      preju: "#dc2626",       // vermelho
                      incompleto: "#4b5563",  // cinza
                    } as Record<string, string>
                  )[b.id] ??
                  "#3b82f6";

                return (
                  <div key={b.id} className="relative flex items-end justify-center">
                    <div
                      style={{
                        height: h,
                        width: 60,
                        backgroundColor: hex,
                        borderRadius: 3,
                      }}
                      aria-hidden
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Linhas de seleção + lucro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {buckets.map((b) => (
              <div
                key={b.id}
                className="flex items-start gap-2 px-2 py-2 rounded-md  border border-border-dark"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-gray-700"
                  checked={checked[b.id]}
                  onChange={(e) =>
                    setChecked((prev) => ({ ...prev, [b.id]: e.target.checked }))
                  }
                />
                <div className="leading-tight">
                  <div className="text-sm font-medium text-color-text">
                    {b.titulo}
                  </div>
                  <div className="text-xs text-color-text">
                    Lucro: {formatBRL(b.lucro)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Painel lateral (legenda) */}
        <aside className="w-40 shrink-0 hidden md:block">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-color-text">Margens</div>
            <button
              className="text-xs text-sky-600 hover:underline"
              onClick={onEditRanges}
              type="button"
            >
              Editar
            </button>
          </div>
          <ul className="space-y-2">
            {legend.map((l) => (
              <li key={l.label} className="flex justify-between text-sm">
                <span className="text-color-text">{l.label}</span>
                <span className="text-text-secondary">{l.range}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
