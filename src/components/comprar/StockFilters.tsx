"use client";

import React, { useState } from "react";
import { HealthStatus } from "@/lib/types";
import { ChevronDown, Filter, MoreVertical, RotateCcw } from "lucide-react";
import { Button } from "../ui/Button";

export function StockFilters(props) {
  const {
    searchTerm,
    setSearchTerm,
    supplierFilter,
    setSupplierFilter,
    setPurchaseStatusFilter,
    stockHealthFilter,
    setStockHealthFilter,
    stockLevelRange,
    setStockLevelRange,
    salesPerDayRange,
    setSalesPerDayRange,
    daysLeftRange,
    setDaysLeftRange,
    purchaseForDaysRange,
    setPurchaseForDaysRange,
    stockAlertFilter,
    setStockAlertFilter,
    zeroStockOnly,
    setZeroStockOnly,
    abcFilter,
    setAbcFilter,
    profitMarginRange,
    setProfitMarginRange,
    onlySelected,
    setOnlySelected,
    selectedProducts,
    onOpenConfigModal,
  } = props;

  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [openActions, setOpenActions] = useState(false);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSupplierFilter("");
    setPurchaseStatusFilter("");
    setStockHealthFilter("");
    setStockLevelRange({ min: "", max: "" });
    setSalesPerDayRange({ min: "", max: "" });
    setDaysLeftRange({ min: "", max: "" });
    setPurchaseForDaysRange({ min: "", max: "" });
    setStockAlertFilter("");
    setZeroStockOnly(false);
    setAbcFilter("");
    setProfitMarginRange({ min: "", max: "" });
    setOnlySelected(false);
  };

  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg shadow-md border border-border-dark">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
          <Filter className="w-4 h-4 text-primary" />
          Filtros
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setOpenActions(!openActions)}
              className={`
                flex items-center gap-2 text-xs
                border border-border-dark 
                px-3 py-2 rounded-md
                bg-background hover:bg-muted 
                transition-all duration-200
                ${openActions ? "bg-muted" : ""}
              `}
            >
              <MoreVertical
                size={16}
                className={`transition-transform duration-200 ${
                  openActions ? "rotate-90 text-primary" : "text-text"
                }`}
              />
              <span>Ações</span>
            </button>

            {openActions && (
              <div className="absolute right-0 mt-2 w-44 bg-popover border border-border-dark shadow-lg rounded-lg z-20 animate-fade-slide">
                <button
                  onClick={() => onOpenConfigModal(selectedProducts)}
                  className="w-full text-left px-3 py-2 text-xs rounded-md bg-background text-text hover:text-primary transition"
                >
                  Listar em Massa
                </button>
              </div>
            )}
          </div>

          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <RotateCcw size={14} />
            Limpar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">Buscar</label>
          <input
            className="w-full p-2 border border-border-dark text-sm rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
            placeholder="Nome, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">Fornecedor</label>
          <input
            className="w-full p-2 border border-border-dark text-sm rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
            placeholder="Digite o fornecedor"
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">Saúde</label>
          <select
            className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
            value={stockHealthFilter}
            onChange={(e) =>
              setStockHealthFilter(e.target.value as HealthStatus | "")
            }
          >
            <option value="">Todos</option>
            <option value="Excelente">Excelente</option>
            <option value="Moderado">Moderado</option>
            <option value="Risco">Risco</option>
            <option value="Parado">Parado</option>
          </select>
        </div>
      </div>

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

      {openAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg border border-border-dark">
          {[
            {
              label: "Estoque atual (min/max)",
              state: stockLevelRange,
              setter: setStockLevelRange,
            },
            {
              label: "Vendas por dia (min/max)",
              state: salesPerDayRange,
              setter: setSalesPerDayRange,
            },
            {
              label: "Dias restantes (min/max)",
              state: daysLeftRange,
              setter: setDaysLeftRange,
            },
            {
              label: "Comprar para X dias (min/max)",
              state: purchaseForDaysRange,
              setter: setPurchaseForDaysRange,
            },
          ].map(({ label, state, setter }, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label className="text-xs text-text-secondary">{label}</label>
              <div className="flex gap-2">
                <input
                  className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
                  placeholder="Min"
                  value={state.min}
                  onChange={(e) => setter({ ...state, min: e.target.value })}
                />
                <input
                  className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
                  placeholder="Max"
                  value={state.max}
                  onChange={(e) => setter({ ...state, max: e.target.value })}
                />
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary">
              Alertas de estoque
            </label>
            <select
              className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
              value={stockAlertFilter}
              onChange={(e) => setStockAlertFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="minimo">Abaixo do mínimo</option>
              <option value="seguranca">Abaixo do segurança</option>
            </select>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={zeroStockOnly}
                onChange={(e) => setZeroStockOnly(e.target.checked)}
              />
              <span className="text-xs text-text">Somente estoque zerado</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={onlySelected}
                onChange={(e) => setOnlySelected(e.target.checked)}
              />
              <span className="text-xs text-text">
                Mostrar apenas selecionados
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary">Ranking ABC</label>
            <select
              className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
              value={abcFilter}
              onChange={(e) => setAbcFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="A">A — Alta rotatividade</option>
              <option value="B">B — Média</option>
              <option value="C">C — Baixa</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary">
              Margem de lucro (%) min/max
            </label>
            <div className="flex gap-2">
              <input
                className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
                placeholder="Min"
                value={profitMarginRange.min}
                onChange={(e) =>
                  setProfitMarginRange({
                    ...profitMarginRange,
                    min: e.target.value,
                  })
                }
              />
              <input
                className="p-2 text-xs border border-border-dark rounded-md bg-background text-text focus:ring-green-700 focus:border-green-700 outline-none"
                placeholder="Max"
                value={profitMarginRange.max}
                onChange={(e) =>
                  setProfitMarginRange({
                    ...profitMarginRange,
                    max: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-end">
        <Button
          className="h-8 text-xs flex gap-2 items-center text-white bg-[#10b97c] hover:bg-[#0d9d6b]"
          onClick={() => console.log("Aplicar filtros")}
        >
          <Filter size={14} />
          APLICAR
        </Button>
      </div>
    </div>
  );
}
