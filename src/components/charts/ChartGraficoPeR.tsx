"use client";

import React, { useMemo } from "react";
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
import { formatBRLShort, formatInt, tooltipBRL } from "@/lib/utils";
import type { SerieDef, LineDef } from "@/components/dashboard/GraficoPeR";

interface ChartGraficoPeRProps {
  data: Array<Record<string, any>>;
  xKey: string;
  series: SerieDef[];
  line: LineDef;
  visible: Set<string>;
  lineVisible: boolean;
  lineStroke: string;
  barColor?: string;
}

export const ChartGraficoPeR: React.FC<ChartGraficoPeRProps> = ({
  data,
  xKey,
  series,
  line,
  visible,
  lineVisible,
  lineStroke,
  barColor,
}) => {
  const bars = useMemo(
    () =>
      series.map((s) => {
        const fill = String(barColor ?? s.color ?? "#00BF63");
        return (
          <Bar
            key={s.key}
            dataKey={s.key}
            stackId="stack"
            fill={fill}
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
    <ResponsiveContainer>
      <ComposedChart
        data={data}
        margin={{ top: 5, right: 12, bottom: 8, left: 8 }}
        barSize={25}
      >
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

        {/* Barras dinâmicas */}
        {bars}

        {/* Linha da receita */}
        {lineVisible && (
          <Line
            key={lineStroke}
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
  );
};

export default ChartGraficoPeR;
