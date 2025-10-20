"use client";

import React from "react";
import { Search, Filter, RefreshCcw, Plus, Download } from "lucide-react"; // Importar Plus e Download
import { Button } from "../ui/Button";

interface ProductFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filterName: string, value: string) => void;
  onSelectAll: () => void;
  // ... outras props de filtro
}

export function ProductFilters({
  onSearch,
  onFilterChange,
  onSelectAll,
}: ProductFiltersProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-border-dark">
      <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
        <div className="relative flex-grow min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar produtos"
            className="w-full pl-10 pr-4 py-2 border border-border-dark rounded-md focus:ring-primary focus:border-primary bg-background text-text"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <select
          className="p-2 border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("origin", e.target.value)}
        >
          <option value="">Origem</option>
          <option value="nacional">Nacional</option>
          <option value="importado">Importado</option>
        </select>
        <select
          className="p-2 border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("channel", e.target.value)}
        >
          <option value="">Canal de Venda</option>
          <option value="ecommerce">E-commerce</option>
          <option value="fisica">Física</option>
        </select>
        <select
          className="p-2 border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("supplier", e.target.value)}
        >
          <option value="">Fornecedor</option>
          <option value="forn1">Fornecedor A</option>
          <option value="forn2">Fornecedor B</option>
        </select>
        <select
          className="p-2 border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("problems", e.target.value)}
        >
          <option value="">Problemas</option>
          <option value="estoque">Estoque baixo</option>
          <option value="preco">Preço desatualizado</option>
        </select>

        <div className="flex items-end ">
          <Button
            className="h-10 w-full flex items-center justify-center gap-2 text-white bg-[#10b97c] hover:bg-[#0d9d6b]"
            onClick={() => onFilterChange("apply", "true")}
          >
            <Filter className="w-4 h-4" />
            FILTRAR
          </Button>
        </div>
      </div>
    </div>
  );
}
