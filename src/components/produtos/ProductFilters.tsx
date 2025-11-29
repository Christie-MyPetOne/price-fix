"use client";

import React, { useState } from "react";
import { Filter, RotateCcw, Search, ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";

interface ProductFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filterName: string, value: string) => void;
  onSelectAll: () => void;
}

const statusOptions = [
  { value: "Precificado", label: "Precificado" },
  { value: "Pendente", label: "Pendente" },
  { value: "Erro", label: "Erro" },
];

const healthOptions = [
  { value: "Excelente", label: "Excelente" },
  { value: "Moderado", label: "Moderado" },
  { value: "Risco", label: "Risco" },
  { value: "Parado", label: "Parado" },
];

const abcOptions = ["A", "B", "C"];
const productTypeOptions = ["Simples", "Kit", "Combo"];

export function ProductFilters({
  onSearch,
  onFilterChange,
}: ProductFiltersProps) {
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [healthFilter, setHealthFilter] = useState("");
  const [abcCurveFilter, setAbcCurveFilter] = useState("");
  const [productTypeFilter, setProductTypeFilter] = useState("");

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setHealthFilter("");
    setAbcCurveFilter("");
    setProductTypeFilter("");
    onSearch("");
    onFilterChange("status", "");
    onFilterChange("health", "");
    onFilterChange("abcCurve", "");
    onFilterChange("productType", "");
  };

  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg shadow-md border border-border-dark">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
          <Filter className="w-4 h-4 text-primary" />
          Filtros
        </h2>
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <RotateCcw size={14} />
          Limpar
        </button>
      </div>

      {/* BASIC FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              className="w-full p-2 pl-10 border border-border-dark text-sm rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
              placeholder="Nome, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">
            Status da Precificação
          </label>
          <select
            className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">
            Saúde do Estoque
          </label>
          <select
            className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
          >
            <option value="">Todos</option>
            {healthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ADVANCED FILTERS TOGGLE */}
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

      {/* ADVANCED FILTERS CONTENT */}
      {openAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background/50 rounded-lg border border-border-dark">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary">Curva ABC</label>
            <select
              className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
              value={abcCurveFilter}
              onChange={(e) => setAbcCurveFilter(e.target.value)}
            >
              <option value="">Todos</option>
              {abcOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary">
              Tipo de Produto
            </label>
            <select
              className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
              value={productTypeFilter}
              onChange={(e) => setProductTypeFilter(e.target.value)}
            >
              <option value="">Todos</option>
              {productTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="w-full flex justify-end mt-2">
        <Button
          className="h-8 text-xs flex gap-2 items-center text-white bg-primary hover:bg-primary/90"
          disabled={true}
          aria-disabled={true}
        >
          <Filter size={14} />
          APLICAR
        </Button>
      </div>
    </div>
  );
}
