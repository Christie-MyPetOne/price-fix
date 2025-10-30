"use client";

import React from "react";
import { Filter } from "lucide-react";
import { PurchaseFiltersProps } from "@/lib/types";
import { Card } from "../ui/Card";

const Button = ({
  children,
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default";
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-gray-800 text-white hover:bg-gray-700",
    outline: "border border-border-dark hover:bg-background",
    ghost: "hover:bg-background",
  };
  const sizes = { default: "h-10 px-4", sm: "h-9 px-3" };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-10 w-full rounded-md border border-border-dark bg-background px-3 py-2 text-sm placeholder:text-text-secondary focus-visible:ring-2 focus-visible:ring-primary ${className}`}
    {...props}
  />
);

const Select = ({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`h-10 rounded-md border border-border-dark bg-background px-3 py-2 text-sm text-text-secondary focus:ring-2 focus:ring-primary ${className}`}
    {...props}
  >
    {children}
  </select>
);

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
        <select
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
          className="border border-gray-300 rounded-md p-2 text-sm"
        >
          <option value="" disabled hidden>
            Ações
          </option>
          <option value="config">Configuração</option>
          <option value="export">Exportar</option>
          <option value="lista">Lista de compras</option>
        </select>

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
