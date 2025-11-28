"use client";

import React, { useEffect, useState } from "react";
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
  selectedKeys?: Set<string>; // 👈 séries selecionadas
  formatBRLShort: (n: number) => string;
  defaultTooltipFormatter: (value: any) => string;
}

export const ChartGraficoBar: React.FC<ChartGraficoBarProps> = ({
  data,
  xKey,
  series,
  selectedKeys,
  formatBRLShort,
  defaultTooltipFormatter,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const dataMobile = isMobile ? data.slice(-6) : data;

  const ticksMobile =
    dataMobile.length > 1
      ? [dataMobile[0][xKey], dataMobile[dataMobile.length - 1][xKey]]
      : [];

  const hasSelection = !!selectedKeys && selectedKeys.size > 0;

  return (
    <div className="w-full h-[250px] md:h-[307px]">
      <ResponsiveContainer>
        <BarChart
          data={dataMobile}
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
            ticks={isMobile ? ticksMobile : undefined}
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

          {series.map((s) => {
            const isSelected = hasSelection && selectedKeys!.has(s.key);

            return (
              <Bar
                key={s.key}
                dataKey={s.key}
                stackId="stack"
                fill={s.color}
                radius={[2, 2, 0, 0]}
                // 👇 regra principal:
                // se NÃO tiver seleção -> mostra tudo
                // se tiver seleção -> só mostra as selecionadas
                hide={hasSelection && !isSelected}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartGraficoBar;
