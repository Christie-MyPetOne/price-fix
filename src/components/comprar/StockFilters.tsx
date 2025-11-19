"use client";

import React from "react";
import { Filter } from "lucide-react";
import { StockFiltersProps, HealthStatus } from "@/lib/types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";

export const StockFilters: React.FC<StockFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  stockHealthFilter,
  setStockHealthFilter,
  onFilter,
  onOpenConfigModal,
  selectedProducts,
}) => {
  const handleStockHealthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as HealthStatus | "";
    setStockHealthFilter(value);
  };

  return (
    <Card className="p-4 bg-card">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-grow min-w-[200px]">
          <Input
            type="text"
            placeholder="Buscar Produto ou SKU"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={stockHealthFilter}
          onChange={handleStockHealthChange}
          className="border rounded-md p-2 text-sm"
        >
          <option value="">Saúde de Estoque</option>
          <option value="Excelente">Excelente</option>
          <option value="Média">Média</option>
          <option value="Risco">Risco</option>
          <option value="Parado">Parado</option>
        </Select>

        <Select
          value=""
          onChange={(e) => {
            const value = e.target.value;
            if (value === "config") {
              onOpenConfigModal(selectedProducts);
            } else if (value === "export") {
              console.log("Exportar");
            } else if (value === "lista") {
              console.log("Lista de compras");
            }
          }}
          className="border rounded-md p-2 text-sm"
        >
          <option value="" disabled hidden>
            Ações
          </option>
          <option value="config">Lista de compras</option>
          <option value="export">Exportar</option>
          <option value="lista">Configuração</option>
        </Select>

        <Button
          variant="primary"
          className="flex items-center gap-1"
          onClick={onFilter}
        >
          <Filter size={16} /> Filtrar
        </Button>
      </div>
    </Card>
  );
};
