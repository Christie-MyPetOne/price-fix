"use client";

import React from "react";
import {
  Settings2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Snowflake,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { StockHealthCardProps } from "./lib/types";

export const StockHealthCard: React.FC<StockHealthCardProps> = ({
  stockConfig,
  onConfigClick,
}) => {
  return (
    <Card className="bg-card md:col-span-1 p-4 md:p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-sm md:text-lg font-semibold mb-3">
          Saúde de estoque
        </h2>

        <div className="text-[0.75rem] sm:text-sm text-text-secondary space-y-1 mb-4">
          <p>
            Comprando para{" "}
            <span className="font-semibold text-text">
              {stockConfig.comprarPara} dias
            </span>
          </p>
          <p>
            Entrega estimada em{" "}
            <span className="font-semibold text-text">
              {stockConfig.entregaEstimada} dias
            </span>
          </p>
        </div>

        <div className="space-y-3 text-sm sm:text-base border-l-2 border-border-dark pl-2 sm:pl-4">
          {[
            {
              label: "Excelente",
              icon: CheckCircle2,
              value: stockConfig.excelente,
              color: "text-green-500",
            },
            {
              label: "Moderado",
              icon: AlertTriangle,
              value: `${stockConfig.excelente + 1} - ${stockConfig.moderado}`,
              color: "text-yellow-500",
            },
            {
              label: "Risco",
              icon: XCircle,
              value: `${stockConfig.moderado + 1} - ${stockConfig.risco}`,
              color: "text-red-500",
            },
            {
              label: "Parado",
              icon: Snowflake,
              value: `${stockConfig.risco + 1}`,
              color: "text-blue-400",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${item.color}`}
              >
                <div className="flex items-center gap-2 mb-1 sm:mb-0">
                  <Icon size={16} />{" "}
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="text-text-secondary">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant="secondary"
        className="mt-4 sm:mt-6 w-full flex items-center justify-center gap-2 text-xs sm:text-sm"
        onClick={onConfigClick}
      >
        <Settings2 size={16} /> Configurar Saúde de Estoque
      </Button>
    </Card>
  );
};
