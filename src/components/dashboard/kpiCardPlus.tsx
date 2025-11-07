"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";


/* --- Tipos --- */
export interface KpiCardPlusProps {
  title: string;
  value: string;
  change: number;
  comparedLabel?: string;
  comparedValue?: string | number;
  className?: string;
  onToggleLista?: () => void;
  listaAtiva?: boolean;
  mode: "reais" | "percentual";
  setMode: (mode: "reais" | "percentual") => void;
}

/* --- Componente KPI Card --- */
export const KpiCardPlus: React.FC<KpiCardPlusProps> = ({
  onToggleLista,
  listaAtiva = false,
  title,
  value,
  change,
  comparedLabel = "Período comparado",
  comparedValue = "—",
  className = "",
  mode,
  setMode,
}) => {
  


  const isPositive = change >= 0;
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  const numericValue = parseFloat(value.replace(/[^\d.-]/g, ""));
  const displayValue =
    mode === "reais"
      ? value
      : `${(numericValue / 1000).toFixed(2)}%`; // Exemplo

  return (
    <Card
      className={`p-6 flex w-full flex-col border border-border-dark bg-card text-text shadow-lg ${className}`}
    >
      {/* Cabeçalho com botões */}
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-2sm text-muted-foreground">{title}</p>
          <p className="text-2xl mt-10 mb-5 font-bold">{displayValue}</p>
        </div>

        {/* Contêiner à direita */}
        <div className="flex flex-col items-end gap-2">
          {/* Botões */}
          <div className="flex gap-2">
            <Button
              className={`h-8 px-2 text-sm border rounded-md transition-colors ${
                mode === "reais"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setMode("reais")}
            >
              R$
            </Button>

            <Button
              className={`h-8 px-2 text-sm border rounded-md transition-colors ${
                mode === "percentual"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setMode("percentual")}
            >
              %
            </Button>

            <Button
              onClick={onToggleLista}
              className={`h-8 px-2 mt text-sm border rounded-md transition ${
                listaAtiva
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {listaAtiva ? "–" : "+"}
            </Button>
          </div>

          {/* Badge abaixo dos botões */}
          <div
            className={`mt-4 flex items-center justify-center rounded-lg px-3 py-1 text-base font-bold shadow-md
            ${isPositive ? "text-primary bg-primary/15" : "text-error bg-error/15"}`}
            title={isPositive ? "Subindo" : "Caindo"}
          >
            <ChangeIcon size={20} strokeWidth={2.5} className="mr-1" />
            {Math.abs(change)}%
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{comparedLabel}</span>
        <span className="text-sm font-semibold flex items-center gap-1">
          {comparedValue}
        </span>
      </div>
    </Card>
  );
};

export default KpiCardPlus;
