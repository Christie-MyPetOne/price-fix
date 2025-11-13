"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { SerieDef } from "@/components/dashboard/GraficoBar";

export interface ChartGraficoBarProps {
  data: Array<Record<string, any>>;
  xKey: string;
  series: SerieDef[];
  visibleKeys: Set<string>;
  formatBRLShort: (n: number) => string;
  defaultTooltipFormatter: (value: any) => string;
}

export const ChartGraficoBar: React.FC<ChartGraficoBarProps> = ({
  data,
  xKey,
  series,
  visibleKeys,
  formatBRLShort,
  defaultTooltipFormatter,
}) => {
  return (
    <div style={{ width: "100%", height: 305 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 15, right: 12, bottom: 8, left: 8 }}
          barSize={18}
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
          <YAxis
            stroke="var(--color-text-secondary)"
            tickFormatter={formatBRLShort}
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <Tooltip
            formatter={defaultTooltipFormatter as any}
            labelStyle={{ color: "var(--color-text)" }}
            contentStyle={{
              background: "var(--color-card)",
              borderColor: "var(--color-border-dark)",
              borderRadius: 8,
            }}
            cursor={{ fill: "var(--color-background)" }}
          />

          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              stackId="stack"
              fill={s.color}
              radius={[2, 2, 0, 0]}
              hide={!visibleKeys.has(s.key)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartGraficoBar;
