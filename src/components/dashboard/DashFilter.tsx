"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const fieldBase =
  "h-10 w-full px-3 border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary";

// Mapeamento dos pares de comparação
const periodOptions: Record<string, string[]> = {
  "Hoje": ["Ontem"],
  "Ontem": [
    "7 dias anteriores",
    "15 dias anteriores",
    "30 dias anteriores",
    "Período personalizado",
  ],
  "Esta semana": [
    "Semana passada",
    "4 semanas anteriores",
    "8 semanas anteriores",
    "12 semanas anteriores",
    "Período personalizado",
  ],
  "Semana passada": [
    "4 semanas anteriores",
    "8 semanas anteriores",
    "12 semanas anteriores",
    "Período personalizado",
  ],
  "Este mês": [
    "Mês passado",
    "2 meses anteriores",
    "4 meses anteriores",
    "6 meses anteriores",
    "Período personalizado",
  ],
  "Mês passado": [
    "2 meses anteriores",
    "4 meses anteriores",
    "6 meses anteriores",
    "Período personalizado",
  ],
  "Período personalizado": ["Período personalizado"],
};

/* ============ Marketplaces Dropdown ============ */
function MarketplacesMultiSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const options = [
    { id: "shopee", label: "Shopee" },
    { id: "mercado_livre", label: "Mercado Livre" },
    { id: "amazon", label: "Amazon" },
  ];

  const allSelected = value.length === options.length;
  const someSelected = value.length > 0 && !allSelected;

  const buttonText =
    value.length === 0
      ? "Selecione marketplaces"
      : value.length === 1
      ? options.find((o) => o.id === value[0])?.label
      : `${value.length} selecionados`;

  function toggle(id: string) {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );
  }

  function toggleAll() {
    onChange(allSelected ? [] : options.map((o) => o.id));
  }

  return (
    <div className="relative">
      <label className="block text-sm text-text-secondary mb-1">
        Marketplaces
      </label>
      <button
        type="button"
        className={`${fieldBase} min-w-[220px] flex items-center justify-between`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate">{buttonText}</span>
        <ChevronDown className="w-4 h-4 opacity-70" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-border-dark bg-card shadow-lg p-2">
          {/* Selecionar todos */}
          <button
            type="button"
            className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm flex items-center gap-2"
            onClick={toggleAll}
          >
            <input
              type="checkbox"
              className="accent-primary"
              readOnly
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected;
              }}
            />
            Selecionar todos
          </button>

          <div className="mt-1 border-t border-border-dark/50" />

          {/* Opções */}
          <div className="py-1">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm flex items-center gap-2"
                onClick={() => toggle(opt.id)}
              >
                <input
                  type="checkbox"
                  className="accent-primary"
                  readOnly
                  checked={value.includes(opt.id)}
                />
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end p-2">
            <button
              className="h-8 px-3 rounded-md bg-primary text-white text-sm"
              onClick={() => setOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/* ============ Filtro Principal ============ */
export function DashFilter() {
  const [resultado, setResultado] = useState<string>("Hoje");
  const [comparado, setComparado] = useState<string>("Ontem");
  const [marketplaces, setMarketplaces] = useState<string[]>([]);

  const handleResultadoChange = (value: string) => {
    setResultado(value);
    const firstOption = periodOptions[value]?.[0] ?? "";
    setComparado(firstOption);
  };

  function applyFilters() {
    console.log("Aplicando filtros:", {
      resultado,
      comparado,
      marketplaces,
    });
    alert(
      `Aplicado:\nResultado de: ${resultado}\nComparado com: ${comparado}\nMarketplaces: ${marketplaces.join(
        ", "
      )}`
    );
  }

return (
  <div className="flex gap-4 bg-card p-4 rounded-lg shadow-md border border-border-dark flex-wrap">
    {/* Resultado de */}
    <div className="flex flex-col">
      <label className="block text-sm text-text-secondary mb-1">
        Resultado de
      </label>
      <select
        className={`${fieldBase} min-w-[220px]`}
        value={resultado}
        onChange={(e) => handleResultadoChange(e.target.value)}
      >
        {Object.keys(periodOptions).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>

    {/* Comparado com */}
    <div className="flex flex-col">
      <label className="block text-sm text-text-secondary mb-1">
        Comparado com
      </label>
      <select
        className={`${fieldBase} min-w-[220px]`}
        value={comparado}
        onChange={(e) => setComparado(e.target.value)}
      >
        {periodOptions[resultado].map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>

    {/* Marketplaces */}
    <div className="flex flex-col">
      <MarketplacesMultiSelect
        value={marketplaces}
        onChange={setMarketplaces}
      />
    </div>

    {/* Botão aplicar */}
    <div className="flex items-end">
      <button
        onClick={applyFilters}
        className="px-6 py-2 rounded-md bg-[#10b97c] hover:bg-[#0d9d6b] text-white font-medium"
      >
        Aplicar
      </button>
    </div>
  </div>
);
}
