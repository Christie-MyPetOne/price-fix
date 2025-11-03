"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

/* ========= utils ========= */
function formatPercentAuto(n: number): string {
  // se estiver entre -1 e 1, trata como fração (0.32 => 32%)
  const v = Math.abs(n) <= 1 ? n * 100 : n;
  return `${v.toFixed(1).replace(".", ",")}%`;
}

type AnyRow = Record<string, any>;

export interface GraficoMargemProps {
  title?: string;
  data: AnyRow[];
  xKey: string;       // ex.: "date"
  yKey?: string;      // ex.: "margem" (default)
  height?: number;    // default 305
}

const GraficoMargem: React.FC<GraficoMargemProps> = ({
  title = "Margem (%)",
  data,
  xKey,
  yKey = "margem",
  height = 305,
}) => {
  // Detecta se valores vêm em fração (-1..1) para ajustar domínio e tooltip
  const { isFraction, domain } = useMemo(() => {
    if (!data?.length) return { isFraction: true, domain: ["auto", "auto"] as const };
    const vals = data.map((d) => Number(d?.[yKey] ?? 0)).filter((v) => !Number.isNaN(v));
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const fraction = Math.max(Math.abs(min), Math.abs(max)) <= 1; // -1..1
    if (fraction) {
      // dá uma folga de 5 p.p.
      const pad = 0.05;
      return { isFraction: true, domain: [min - pad, max + pad] as [number, number] };
    }
    return { isFraction: false, domain: ["auto", "auto"] as const };
  }, [data, yKey]);

  const tooltipFormatter = (value: any) => {
    const n = Number(value);
    return formatPercentAuto(n);
  };

  return (
    <div className="rounded-xl border border-border-dark bg-card text-text shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 12, bottom: 8, left: 8 }}>
            <defs>
              <linearGradient id="margemFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-dark)" />
            <XAxis
              dataKey={xKey}
              stroke="var(--color-text-secondary)"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={domain as any}
              stroke="var(--color-text-secondary)"
              tickFormatter={(v) => formatPercentAuto(Number(v))}
              tickLine={false}
              axisLine={false}
              width={60}
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

            {/* Linha de referência em 0% (caso haja valores negativos) */}
            {isFraction && <ReferenceLine y={0} stroke="var(--color-border-dark)" />}

            <Area
              type="monotone"
              dataKey={yKey}
              stroke="#10b981"
              fill="url(#margemFill)"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficoMargem;
