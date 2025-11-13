"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import { ProductFiltersProps } from "@/lib/types";
import { Button } from "../ui/Button";

export function ProductFilters({
  onSearch,
  onFilterChange,
}: ProductFiltersProps) {
  return (
    <div className="flex-wrap mb-6 items-center md:mt-0 bg-card p-2 rounded-lg shadow-md flex md:flex-row md:items-center justify-between gap-3 border border-border-dark">
      <div className="relative flex-grow min-w-[12rem] max-w-xs text-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Buscar produtos"
          className="w-full pl-10 pr-4 py-2 border border-border-dark rounded-md focus:ring-primary focus:border-primary bg-background text-text"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <select
        className="p-2 border text-xs border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary"
        onChange={(e) => onFilterChange("channel", e.target.value)}
      >
        <option value="">Canal de Venda</option>
        <option value="ecommerce">E-commerce</option>
        <option value="fisica">Física</option>
      </select>
      <select
        className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary"
        onChange={(e) => onFilterChange("supplier", e.target.value)}
      >
        <option value="">Fornecedor</option>
        <option value="forn1">Fornecedor A</option>
        <option value="forn2">Fornecedor B</option>
      </select>
      <select
        className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary"
        onChange={(e) => onFilterChange("problems", e.target.value)}
      >
        <option value="">Problemas</option>
        <option value="estoque">Estoque baixo</option>
        <option value="preco">Preço desatualizado</option>
      </select>

      <div className="flex">
        <Button
          className="h-8 w-full text-xs flex gap-2 items-center text-white bg-[#10b97c] hover:bg-[#0d9d6b]"
          onClick={() => onFilterChange("apply", "true")}
        >
          <Filter className="w-4 h-4" />
          FILTRAR
        </Button>
      </div>
    </div>
  );
}
