"use client";

import React, { useState } from "react";
import { Filter, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/Button";

export interface VendasFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filterName: string, value: string) => void;
  onSelectAll: (checked: boolean) => void;
}

const fieldBase =
  "h-10 w-full px-3 border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary";

export function VendasFilters({
  onSearch,
  onFilterChange,
  onSelectAll,
}: VendasFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card p-3 md:p-4 rounded-lg shadow-md border border-border-dark">
      {/* Header + botão toggle (somente no mobile) */}
      
      
      <div className="flex items-center gap-2">
      

        {/* botão abre/fecha filtros no mobile */}
        <button
          className="md:hidden flex items-center gap-1 px-2 py-1 border border-border-dark rounded-md text-sm text-text-secondary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <>
              Esconder <ChevronUp size={14} />
            </>
          ) : (
            <>
              Filtros <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>
      

      {/* Grid de filtros: escondido no mobile quando fechado */}
      <div className={`${open ? "block" : "hidden"} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Busca */}
          <div className="w-full">
            <input
              type="text"
              placeholder="Buscar por código, cliente, produto..."
              className={fieldBase}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* Data */}
          <div className="w-full">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              <input
                type="date"
                className={`${fieldBase} pl-10`}
                onChange={(e) => onFilterChange("date", e.target.value)}
              />
            </div>
          </div>

          {/* Empresas */}
          <div className="w-full">
            <select
              className={`${fieldBase} appearance-none`}
              onChange={(e) => onFilterChange("empresa", e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Empresas
              </option>
              <option value="empresa-a">Empresa A</option>
              <option value="empresa-b">Empresa B</option>
            </select>
          </div>

          {/* Canais */}
          <div className="w-full">
            <select
              className={`${fieldBase} appearance-none`}
              onChange={(e) => onFilterChange("canal", e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Canais de vendas
              </option>
              <option value="ecommerce">E-commerce</option>
              <option value="marketplace">Marketplace</option>
              <option value="loja-fisica">Loja Física</option>
            </select>
          </div>

          {/* Produtos */}
          <div className="w-full">
            <select
              className={`${fieldBase} appearance-none`}
              onChange={(e) => onFilterChange("produto", e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Produtos
              </option>
              <option value="produto-a">Produto A</option>
              <option value="produto-b">Produto B</option>
            </select>
          </div>

          {/* Botão Filtrar */}
          <div className="flex items-end w-full">
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
    </div>
  );
}
