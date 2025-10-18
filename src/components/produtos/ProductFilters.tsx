"use client";

import React from "react";
import { Search, Filter, RefreshCcw } from "lucide-react";
import { Button } from "../ui/Button"; // Usaremos um Button aqui, se não tiver, crie um simples
import { Plus, Download } from "lucide-react"; // Certifique-se de importar esses ícones

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
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Botões de Ação */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="flex items-center gap-1">
          <RefreshCcw className="w-4 h-4" />
          Sincronizar
        </Button>
        <Button variant="primary" className="flex items-center gap-1">
          <Plus className="w-4 h-4" />{" "}
          {/* Assumindo que você terá um ícone Plus */}
          Novo Produto
        </Button>
        <Button variant="outline" className="flex items-center gap-1">
          <Download className="w-4 h-4" />{" "}
          {/* Assumindo que você terá um ícone Download */}
          Exportar Produtos
        </Button>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
        <div className="relative flex-grow min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Dropdowns de Filtro */}
        <select
          className="p-2 border border-gray-300 rounded-md bg-white focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("line", e.target.value)}
        >
          <option value="">Linha</option>
          <option value="eletronicos">Eletrônicos</option>
          <option value="moda">Moda</option>
        </select>
        <select
          className="p-2 border border-gray-300 rounded-md bg-white focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("origin", e.target.value)}
        >
          <option value="">Origem</option>
          <option value="nacional">Nacional</option>
          <option value="importado">Importado</option>
        </select>
        {/* Adicione mais selects para Canal de Venda, Fornecedor, Problemas */}
        <select
          className="p-2 border border-gray-300 rounded-md bg-white focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("channel", e.target.value)}
        >
          <option value="">Canal de Venda</option>
          <option value="ecommerce">E-commerce</option>
          <option value="fisica">Física</option>
        </select>
        <select
          className="p-2 border border-gray-300 rounded-md bg-white focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("supplier", e.target.value)}
        >
          <option value="">Fornecedor</option>
          <option value="forn1">Fornecedor A</option>
          <option value="forn2">Fornecedor B</option>
        </select>
        <select
          className="p-2 border border-gray-300 rounded-md bg-white focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("problems", e.target.value)}
        >
          <option value="">Problemas</option>
          <option value="estoque">Estoque baixo</option>
          <option value="preco">Preço desatualizado</option>
        </select>

        <Button variant="secondary" className="flex items-center gap-1">
          <Filter className="w-4 h-4" />
          FILTRAR
        </Button>
      </div>
    </div>
  );
}
