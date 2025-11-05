"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { Span } from "next/dist/trace";
import { Card } from "@/components/ui/Card";


/* --- Tipos do KPI --- */
export interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  sparklineData: { value: number }[];
  comparedLabel?: string;
  comparedValue?: string | number;
  className?: string; 
}

/* --- Componente KPI Card --- */
export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  sparklineData,
  comparedLabel = "Período comparado",
  comparedValue = "—",
  className = "",
}) => {
  const isPositive = change >= 0;
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className={`p-6 flex w-full flex-col ${className}`}>
      {/* Título / Valor */}
      <span>
        <p className="text-2sm text-text-secondary">{title}</p>
        <p className="text-2xl font-bold mt-10 mb-2">{value}</p>
      </span>

      {/* Gráfico + Variação */}
      <div className="-mt-11 -mb-5 flex justify-end">
        <div className="flex grid-cols-5   relative w-36 h-20">
          {/* Badge de variação GRANDE */}
          <div
            className={`mb-2 -mt-5 absolute -top-6 right-0 flex items-center gap-2 rounded-lg px-3 py-1.5 text-base font-bold shadow-md
            ${isPositive ? "text-primary bg-primary/15" : "text-error bg-error/15"}`}
            title={isPositive ? "Subindo" : "Caindo"}
          >
            <ChangeIcon size={22} strokeWidth={2.5} />
            {Math.abs(change)}%
          </div>

          {/* Gráfico mais alto e mais próximo do topo */}
          <ResponsiveContainer>
            <LineChart data={sparklineData} margin={{ top: 8, bottom: 0, left: 0, right: 0 }}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "var(--color-primary)" : "var(--color-error)"}
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-4 pt-3 border-t border-border-dark/60 flex items-center justify-between">
        <span className="text-xs text-text-secondary">{comparedLabel}</span>
        <span className="text-sm font-semibold">{comparedValue}</span>
      </div>
    </Card>
  );
};

export default KpiCard;
