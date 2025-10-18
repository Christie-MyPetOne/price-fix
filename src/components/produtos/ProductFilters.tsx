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
    <div className="bg-card p-6 rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-border-dark">
      {/* Botões de Ação */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-1 text-text-secondary"
        >
          <RefreshCcw className="w-4 h-4" />
          Sincronizar
        </Button>
        <Button variant="primary" className="flex items-center gap-1">
          {" "}
          {/* Usando a nova cor primary */}
          <Plus className="w-4 h-4" />
          Novo Produto
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-1 text-text-secondary"
        >
          <Download className="w-4 h-4" />
          Exportar Produtos
        </Button>
      </div>

      {/* Barra de Pesquisa e Filtros */}
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

        {/* Dropdowns de Filtro */}
        <select
          className="p-2 border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("line", e.target.value)}
        >
          <option value="">Linha</option>
          <option value="eletronicos">Eletrônicos</option>
          <option value="moda">Moda</option>
        </select>
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

        <Button
          variant="secondary"
          className="flex items-center gap-1 text-text-secondary"
        >
          <Filter className="w-4 h-4" />
          FILTRAR
        </Button>
      </div>
    </div>
  );
}
