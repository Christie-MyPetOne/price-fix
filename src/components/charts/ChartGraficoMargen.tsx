"use client";

import React from "react";
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

/* utils locais */
function formatPercentAuto(n: number): string {
  const v = Math.abs(n) <= 1 ? n * 100 : n;
  return `${v.toFixed(1).replace(".", ",")}%`;
}

export interface ChartGraficoMargemProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  domain: readonly [number, number] | readonly ["auto", "auto"];
  isFraction: boolean;
}

export const ChartGraficoMargem: React.FC<ChartGraficoMargemProps> = ({
  data,
  xKey,
  yKey,
  domain,
  isFraction,
}) => {
  const tooltipFormatter = (value: any) => {
    const n = Number(value);
    return formatPercentAuto(n);
  };

  return (
    <ResponsiveContainer>
      <AreaChart data={data} margin={{ top: 5, right: 12, bottom: 8, left: 8 }}>
        <defs>
          <linearGradient id="margemFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border-dark)"
        />

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

        {isFraction && (
          <ReferenceLine y={0} stroke="var(--color-border-dark)" />
        )}

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
  );
};

export default ChartGraficoMargem;
