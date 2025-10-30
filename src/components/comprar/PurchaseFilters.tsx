"use client";

import React from "react";
import { Filter } from "lucide-react";
import { PurchaseFiltersProps } from "@/lib/types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";

export const PurchaseFilters: React.FC<PurchaseFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  stockHealthFilter,
  setStockHealthFilter,
  onFilter,
  onOpenConfigModal,
  selectedProducts,
}) => {
  return (
    <Card className="p-4">
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
          onChange={(e) => {
            const value = e.target.value;
            if (value === "config") {
              onOpenConfigModal(selectedProducts);
              setStockHealthFilter("");
            } else {
              setStockHealthFilter(value);
            }
          }}
          className="border rounded-md p-2 text-sm"
        >
          <option value="" disabled hidden>
            Ações
          </option>
          <option value="config">Configuração</option>
          <option value="export">Exportar</option>
          <option value="lista">Lista de compras</option>
        </Select>

        <Select
          value={stockHealthFilter}
          onChange={(e) => setStockHealthFilter(e.target.value)}
        >
          <option value="">Saúde de Estoque</option>
          <option value="Bom">Bom</option>
          <option value="Média">Média</option>
          <option value="Ruim">Ruim</option>
          <option value="Congelado">Congelado</option>
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
