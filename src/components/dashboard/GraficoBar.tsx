"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatBRLShort, defaultTooltipFormatter } from "@/lib/utils";
import ChartGraficoBar from "@/components/charts/ChartGraficoBar";

export interface SerieDef {
  key: string;
  label: string;
  color: string;
  total?: number;
}

export interface GraficoBarCanaisProps {
  title?: string;
  data: Array<Record<string, any>>;
  xKey: string;
  series: SerieDef[];
  legendPageSize?: number;
}

export const GraficoBar: React.FC<GraficoBarCanaisProps> = ({
  title = "Receita por canal de venda",
  data,
  xKey,
  series,
  legendPageSize = 6,
}) => {
  // 👉 Set com as séries selecionadas
  // regra: tamanho 0 = todas visíveis
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [page, setPage] = useState(0);

  const pages = Math.max(1, Math.ceil(series.length / legendPageSize));
  const start = page * legendPageSize;
  const end = start + legendPageSize;
  const pageItems = series.slice(start, end);

  const hasSelection = selectedKeys.size > 0;

  function toggleKey(k: string) {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(k)) {
        next.delete(k);
      } else {
        next.add(k);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedKeys(new Set());
  }

  function selectAll() {
    // opcional: marcar todas como selecionadas
    setSelectedKeys(new Set(series.map((s) => s.key)));
  }

  return (
    <div className="rounded-xl border border-border-dark bg-card text-text shadow-lg p-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold mr-2">{title}</h2>

        <div className="flex flex-wrap items-center gap-2">
          {pageItems.map((s) => {
            const isSelected = selectedKeys.has(s.key);
            const active = hasSelection ? isSelected : true; // quando não tem seleção, todas parecem “ativas”

            const baseClasses =
              "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs border transition-all";
            const stateClasses = active
              ? "bg-background border-border-dark"
              : "opacity-40 bg-background border-border-dark";

            return (
              <button
                key={s.key}
                type="button"
                onClick={() => toggleKey(s.key)}
                className={[baseClasses, stateClasses].join(" ")}
                title={s.label}
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: s.color }}
                />
                <span className="whitespace-nowrap">
                  {s.label}
                  {typeof s.total === "number" ? ` (${s.total})` : ""}
                </span>
              </button>
            );
          })}

          {pages > 1 && (
            <div className="ml-2 inline-flex items-center gap-1">
              <button
                className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-border-dark hover:bg-muted"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs tabular-nums">
                {page + 1}/{pages}
              </span>
              <button
                className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-border-dark hover:bg-muted"
                onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                disabled={page === pages - 1}
                aria-label="Próxima página"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="ml-2 inline-flex gap-2">
            <button
              onClick={selectAll}
              className="h-7 px-2 inline-flex items-center rounded-full border border-border-dark text-xs hover:bg-muted"
              type="button"
            >
              Selecionar todos
            </button>
          </div>
        </div>
      </div>

      <ChartGraficoBar
        data={data}
        xKey={xKey}
        series={series}
        selectedKeys={selectedKeys} // 👈 aqui vai o Set de selecionados
        formatBRLShort={formatBRLShort}
        defaultTooltipFormatter={defaultTooltipFormatter}
      />

      <div className="text-center text-xs text-text-secondary mt-2">
        {hasSelection ? (
          <>
            <span className="font-semibold">
              {selectedKeys.size}
            </span>{" "}
            série(s) selecionada(s)
          </>
        ) : (
          <>Nenhuma série selecionada — exibindo todas</>
        )}
      </div>
    </div>
  );
};

export default GraficoBar;
