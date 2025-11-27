"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { ProductFiltersProps } from "@/lib/types";
import { Button } from "../ui/Button";

export function ProductFilters({
  onSearch,
  onFilterChange,
}: ProductFiltersProps) {
  const [openAdvanced, setOpenAdvanced] = useState(false);

  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg shadow-md border border-border-dark">
      {/* ----------- LINHA SUPERIOR ----------- */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        {/* Input de Busca */}
        <div className="relative flex-grow min-w-[12rem] max-w-xs text-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar produtos"
            className="w-full pl-10 pr-4 py-2 border border-border-dark rounded-md 
                       focus:ring-primary focus:border-primary bg-background text-text"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Canal */}
        <select
          className="p-2 text-xs min-w-[12rem] border border-border-dark rounded-md 
                     bg-background text-text focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("channel", e.target.value)}
        >
          <option value="">Canal de Venda</option>
          <option value="ecommerce">E-commerce</option>
          <option value="fisica">Física</option>
        </select>

        {/* Fornecedor */}
        <select
          className="p-2 text-xs border border-border-dark rounded-md bg-background text-text 
                     focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("supplier", e.target.value)}
        >
          <option value="">Fornecedor</option>
          <option value="forn1">Fornecedor A</option>
          <option value="forn2">Fornecedor B</option>
        </select>

        {/* Status */}
        <select
          className="p-2 text-xs border border-border-dark rounded-md bg-background text-text 
                     focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("status", e.target.value)}
        >
          <option value="">Status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="out_of_stock">Sem Estoque</option>
        </select>

        {/* Origem */}
        <select
          className="p-2 text-xs border border-border-dark rounded-md bg-background text-text 
                     focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("problems", e.target.value)}
        >
          <option value="">Origem</option>
          <option value="estoque">Tiny</option>
          <option value="preco">Base</option>
        </select>

        {/* Botão Filtrar */}
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

      {/* ----------- BOTÃO FILTROS AVANÇADOS ----------- */}
      <button
        className="flex items-center gap-2 text-xs text-primary w-fit"
        onClick={() => setOpenAdvanced(!openAdvanced)}
      >
        <ChevronDown
          size={14}
          className={`transition-transform ${openAdvanced ? "rotate-180" : ""}`}
        />
        Filtros avançados
      </button>

      {/* ----------- CONTEÚDO AVANÇADO ----------- */}
      {openAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg border border-border-dark">
          {/* Ranking ABC */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary">Ranking ABC</label>
            <select
              className="p-2 text-xs border border-border-dark rounded-md 
                         bg-background text-text focus:ring-primary focus:border-primary"
              onChange={(e) => onFilterChange("abc", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="A">A — Alta rotatividade</option>
              <option value="B">B — Média</option>
              <option value="C">C — Baixa</option>
            </select>
          </div>

          {/* Tipo de Produto */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary">
              Tipo de Produto
            </label>
            <select
              className="p-2 text-xs border border-border-dark rounded-md 
                         bg-background text-text focus:ring-primary focus:border-primary"
              onChange={(e) => onFilterChange("productType", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="normal">Normal</option>
              <option value="kit">Kit</option>
              <option value="variacao">Variação</option>
              <option value="servico">Serviço</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
