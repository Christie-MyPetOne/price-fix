"use client";

import React from "react";
import {
  Settings2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Snowflake,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { StockHealthCardProps } from "@/lib/types";

export const StockHealthCard: React.FC<StockHealthCardProps> = ({
  stockConfig,
  onConfigClick,
}) => {
  return (
    <Card className="bg-card md:col-span-1 p-4 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-md font-semibold mb-3">Saúde de estoque</h2>

        <div className="text-xs text-text-secondary space-y-1 mb-4">
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

        <div className="space-y-2 text-sm border-l-2 border-border-dark pl-4">
          <div className="flex justify-between items-center text-green-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>Excelente</span>
            </div>
            <span className="flex items-center gap-1 text-text-secondary">
              <ChevronLeft size={12} /> {stockConfig.excelente}
            </span>
          </div>

          <div className="flex justify-between items-center text-yellow-500">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-yellow-500" />
              <span>Moderado</span>
            </div>
            <span className="text-text-secondary">
              {stockConfig.excelente + 1} - {stockConfig.moderado}
            </span>
          </div>

          <div className="flex justify-between items-center text-red-500">
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-red-500" />
              <span>Risco</span>
            </div>
            <span className="text-text-secondary">
              {stockConfig.moderado + 1} - {stockConfig.risco}
            </span>
          </div>

          <div className="flex justify-between items-center text-blue-400">
            <div className="flex items-center gap-2">
              <Snowflake size={16} className="text-blue-400" />
              <span>Parado</span>
            </div>
            <span className="flex items-center gap-1 text-text-secondary">
              <ChevronRight size={12} /> {stockConfig.risco + 1}
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="secondary"
        className="mt-6 w-full flex items-center justify-center gap-2 text-sm"
        onClick={onConfigClick}
      >
        <Settings2 size={16} /> Configurar Saúde de Estoque
      </Button>
    </Card>
  );
};
