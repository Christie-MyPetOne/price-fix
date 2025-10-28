"use client";

import React from "react";
import { Settings2, ChevronLeft, ChevronRight } from "lucide-react";
import { StockConfig } from "@/lib/types";
import { Button } from "../ui/Button";

const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={`bg-card rounded-lg border border-border-dark shadow-sm ${className}`}
  >
    {children}
  </div>
);

interface PurchaseHealthCard {
  stockConfig: StockConfig;
  onConfigClick: () => void;
}

export const PurchaseHealthCard: React.FC<PurchaseHealthCard> = ({
  stockConfig,
  onConfigClick,
}) => {
  return (
    <Card className="md:col-span-1 p-4 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-md font-semibold mb-3">Saúde de estoque</h2>
        <div className="text-xs text-text-secondary space-y-1 mb-4">
          <p>
            Comprando para{" "}
            <span className="font-semibold text-text">
              {stockConfig.purchaseForDays} Dias
            </span>
          </p>
          <p>
            Entrega estimada em{" "}
            <span className="font-semibold text-text">
              {stockConfig.deliveryEstimateDays} Dias
            </span>
          </p>
        </div>

        <div className="space-y-2 text-sm border-l-2 border-border-dark pl-4">
          <div className="flex justify-between items-center text-primary">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary block"></span>
              <span>Bom</span>
            </div>
            <span className="flex items-center gap-1 text-text-secondary">
              <ChevronLeft size={12} /> {stockConfig.healthLevels.good}
            </span>
          </div>

          <div className="flex justify-between items-center text-warning">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning block"></span>
              <span>Moderado</span>
            </div>
            <span className="text-text-secondary">
              {stockConfig.healthLevels.good + 1} -{" "}
              {stockConfig.healthLevels.ruim}
            </span>
          </div>

          <div className="flex justify-between items-center text-error">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-error block"></span>
              <span>Risco</span>
            </div>
            <span className="flex items-center gap-1 text-text-secondary">
              <ChevronRight size={12} /> {stockConfig.healthLevels.ruim + 1}
            </span>
          </div>

          <div className="flex justify-between items-center text-blue-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-400 block"></span>
              <span>Parado</span>
            </div>
            <span className="flex items-center gap-1 text-text-secondary">
              <ChevronRight size={12} /> {stockConfig.healthLevels.frozen}
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
