"use client";

import React from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { VendasFiltersProps } from "@/lib/types";

export function VendasFilters({
  onSearch,
  onFilterChange,
}: VendasFiltersProps) {
  return (
    <div className="flex flex-wrap justify-between mb-6 items-center bg-card p-3 rounded-lg shadow-md gap-3 border border-border-dark">
      <div className="relative flex-grow min-w-[12rem] max-w-xs text-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Buscar por código, cliente ou produto..."
          className="w-full pl-10 pr-4 py-2 border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="relative min-w-[10rem] text-xs">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="date"
          className="pl-10 pr-3 py-2 border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary"
          onChange={(e) => onFilterChange("date", e.target.value)}
        />
      </div>

      <select
        className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary min-w-[7rem]"
        onChange={(e) => onFilterChange("empresa", e.target.value)}
        defaultValue=""
      >
        <option value="">Empresas</option>
        <option value="empresa-a">Empresa A</option>
        <option value="empresa-b">Empresa B</option>
      </select>

      <select
        className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary min-w-[10rem]"
        onChange={(e) => onFilterChange("canal", e.target.value)}
        defaultValue=""
      >
        <option value="">Canais de vendas</option>
        <option value="ecommerce">E-commerce</option>
        <option value="marketplace">Marketplace</option>
        <option value="loja-fisica">Loja Física</option>
      </select>

      <div className="flex min-w-[8rem]">
        <Button
          className="h-8 w-full text-xs flex gap-2 items-center justify-center text-white bg-[#10b97c] hover:bg-[#0d9d6b]"
          onClick={() => onFilterChange("apply", "true")}
        >
          <Filter className="w-4 h-4" />
          FILTRAR
        </Button>
      </div>
    </div>
  );
}
