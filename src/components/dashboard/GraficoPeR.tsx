"use client";

import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ================= Utils ================= */

function formatBRLShort(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1)} mi`;
  if (abs >= 1_000) return `R$ ${Math.round(n / 1000)} mil`;
  return `R$ ${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(n)}`;
}
function formatInt(n: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(n);
}
function tooltipBRL(value: any) {
  return `R$ ${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value as number)}`;
}

/* ============== Types ============== */
export interface SerieDef {
  key: string;   // campo do objeto de data (ex.: "pedidos")
  label: string; // nome na legenda
  color?: string; // cor da barra (opcional se usar barColor global)
  total?: number;
}

export interface LineDef {
  key: string;         // campo da linha (ex.: "receita")
  label: string;       // nome exibido
  color?: string;      // cor da linha/pontos
  dot?: boolean;       // exibir pontos
}

export interface GraficoPeRLinhaProps {
  title?: string;
  data: Array<Record<string, any>>;
  xKey: string;           // ex.: "mes"
  series?: SerieDef[];    // barras
  line?: LineDef;         // linha
  /** Cor global das barras. Se informado, sobrescreve series[].color */
  barColor?: string;
  /** Cor global da linha. Se informado, sobrescreve line.color */
  lineColor?: string;
  legendPageSize?: number;
}

/* ===== Defaults ===== */
const DEFAULT_SERIES: SerieDef[] = [
  { key: "pedidos", label: "Pedidos", color: "#00BF63" },
];

const DEFAULT_LINE: LineDef = {
  key: "receita",
  label: "Receita (R$)",
  color: "#2563EB",
  dot: true,
};

/* ============== Component ============== */
export const GraficoPeR: React.FC<GraficoPeRLinhaProps> = ({
  title = "Pedidos (barras) x Receita (linha)",
  data,
  xKey,
  series = DEFAULT_SERIES,
  line = DEFAULT_LINE,
  barColor="#10B981",           // ← override global barras
  lineColor="#1C2611",         // ← override global linha
  legendPageSize = 6,
}) => {
  const [visible, setVisible] = useState<Set<string>>(
    () => new Set(series.map((s) => s.key))
  );
  const [lineVisible, setLineVisible] = useState(true);
  const [page, setPage] = useState(0);

  const pages = Math.max(1, Math.ceil(series.length / legendPageSize));
  const start = page * legendPageSize;
  const end = start + legendPageSize;
  const pageItems = series.slice(start, end);

  function toggleKey(k: string) {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }
  function selectAll() {
    setVisible(new Set(series.map((s) => s.key)));
    setLineVisible(true);
  }
  function invertSelection() {
    setVisible((prev) => {
      const next = new Set<string>();
      series.forEach((s) => {
        if (!prev.has(s.key)) next.add(s.key);
      });
      return next;
    });
    setLineVisible((v) => !v);
  }

  // Cor efetiva da linha (global > prop da linha > default)
  const lineStroke = String(lineColor ?? line?.color ?? "#2563EB");

  // Barras geradas a partir de 'series'
  const bars = useMemo(
    () =>
      series.map((s) => {
        // Cor efetiva da barra (global > cor da série > fallback)
        const barFill = String(barColor ?? s.color ?? "#00BF63");
        return (
          <Bar
            key={s.key}
            dataKey={s.key}
            stackId="stack"
            fill={barFill}
            radius={[4, 4, 0, 0]}
            hide={!visible.has(s.key)}
            yAxisId="left"
          />
        );
      }),
    [series, visible, barColor]
  );

  function tooltipFormatter(value: any, name: string, entry: any) {
    if (entry?.dataKey === line.key) return [tooltipBRL(value), line.label];
    return [
      formatInt(value as number),
      series.find((s) => s.key === entry?.dataKey)?.label ?? name,
    ];
  }

  return (
    <div className="grafico-per rounded-xl border border-border-dark bg-card text-text shadow-lg p-4">
      {/* Título + Legenda paginada */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold mr-2">{title}</h2>

        {/* Itens da legenda (paginada) */}
        <div className="flex flex-wrap items-center gap-2">
          {pageItems.map((s) => {
            const active = visible.has(s.key);
            // Mostrar na “pill” a cor real da barra
            const chipColor = String(barColor ?? s.color ?? "#00BF63");
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => toggleKey(s.key)}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs border",
                  active
                    ? "bg-background border-border-dark"
                    : "opacity-50 hover:opacity-70 bg-background border-border-dark",
                ].join(" ")}
                title={s.label}
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: chipColor }}
                />
                <span className="whitespace-nowrap">
                  {s.label}
                  {typeof s.total === "number" ? ` (${s.total})` : ""}
                </span>
              </button>
            );
          })}

          {/* Item da legenda para a LINHA */}
          <button
            type="button"
            onClick={() => setLineVisible((v) => !v)}
            className={[
              "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs border",
              lineVisible
                ? "bg-background border-border-dark"
                : "opacity-50 hover:opacity-70 bg-background border-border-dark",
            ].join(" ")}
            title={line.label}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: lineStroke }}
            />
            <span className="whitespace-nowrap">{line.label}</span>
          </button>

          {/* Paginação */}
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
        </div>
      </div>

      {/* Gráfico */}
      <div style={{ width: "100%", height: 305 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 12, bottom: 8, left: 8 }}
            barSize={25}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-dark)" />
            <XAxis
              dataKey={xKey}
              stroke="var(--color-text-secondary)"
              tickLine={false}
              axisLine={false}
            />

            {/* Y esquerdo: barras (pedidos) */}
            <YAxis
              yAxisId="left"
              stroke="var(--color-text-secondary)"
              tickFormatter={formatInt}
              tickLine={false}
              axisLine={false}
              width={52}
            />

            {/* Y direito: linha (receita) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--color-text-secondary)"
              tickFormatter={formatBRLShort}
              tickLine={false}
              axisLine={false}
              width={70}
            />

            <Tooltip
              formatter={tooltipFormatter as any}
              labelStyle={{ color: "var(--color-text)" }}
              contentStyle={{
                background: "var(--color-card)",
                borderColor: "var(--color-border-dark)",
                borderRadius: 8,
              }}
              cursor={{ fill: "var(--color-background)" }}
            />

            {bars}

            {/* Linha de receita */}
            {lineVisible && (
              <Line
                key={lineStroke} // força remount quando a cor muda
                yAxisId="right"
                type="monotone"
                dataKey={line.key}
                name={line.label}
                stroke={lineStroke}
                strokeWidth={2.5}
                isAnimationActive={false}
                dot={
                  line.dot ?? true
                    ? { r: 3, stroke: lineStroke, fill: "#fff" }
                    : false
                }
                activeDot={{ r: 5, stroke: lineStroke, fill: "#fff" }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficoPeR;
