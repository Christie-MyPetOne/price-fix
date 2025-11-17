// src/components/dashboard/DashFilter.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import { DateRangePopover } from "@/components/dashboard/DateRangePopover";
import type { Range } from "@/components/dashboard/DateRangePicker";

import { SingleSelect } from "./SingleSelect";
import { EmpresasMultiSelect, MarketplacesMultiSelect } from "./MultiSelects";

import { periodOptions, formatDate } from "@/lib/date-range";
import { useIsMobile } from "@/hooks/useIsMobile";

export function DashFilter() {
  const [resultado, setResultado] = useState<string>("Hoje");
  const [comparado, setComparado] = useState<string>("Ontem");
  const [marketplaces, setMarketplaces] = useState<string[]>([]);
  const [empresas, setEmpresas] = useState<string[]>([]);
  const [compararPor, setCompararPor] = useState<"Média" | "Somatória">(
    "Somatória"
  );

  const isMobile = useIsMobile();

  const [resultadoRange, setResultadoRange] = useState<Range>({});
  const [comparadoRange, setComparadoRange] = useState<Range>({});
  const [showResultadoCalendar, setShowResultadoCalendar] = useState(false);
  const [showComparadoCalendar, setShowComparadoCalendar] = useState(false);

  useEffect(() => {
    if (resultado === "Período personalizado") setShowResultadoCalendar(true);
  }, [resultado]);

  useEffect(() => {
    if (comparado === "Período personalizado") setShowComparadoCalendar(true);
  }, [comparado]);

  const handleResultadoChange = (value: string) => {
    setResultado(value);
    const firstOption = periodOptions[value]?.[0] ?? "";
    setComparado(firstOption);
    if (value !== "Período personalizado") setResultadoRange({});
  };

  const resultadoLabel = useMemo(() => {
    if (
      resultado === "Período personalizado" &&
      resultadoRange.start &&
      resultadoRange.end
    ) {
      return `${formatDate(resultadoRange.start)} – ${formatDate(
        resultadoRange.end
      )}`;
    }
    return resultado;
  }, [resultado, resultadoRange.start, resultadoRange.end]);

  const comparadoLabel = useMemo(() => {
    if (
      comparado === "Período personalizado" &&
      comparadoRange.start &&
      comparadoRange.end
    ) {
      return `${formatDate(comparadoRange.start)} – ${formatDate(
        comparadoRange.end
      )}`;
    }
    return comparado;
  }, [comparado, comparadoRange.start, comparadoRange.end]);

  function applyFilters() {
    const resPeriodo =
      resultado === "Período personalizado" &&
      resultadoRange.start &&
      resultadoRange.end
        ? `${formatDate(resultadoRange.start)} – ${formatDate(
            resultadoRange.end
          )}`
        : resultado;

    const compPeriodo =
      comparado === "Período personalizado" &&
      comparadoRange.start &&
      comparadoRange.end
        ? `${formatDate(comparadoRange.start)} – ${formatDate(
            comparadoRange.end
          )}`
        : comparado;

    alert(
      `Aplicado:
Resultado de: ${resPeriodo}
Comparado com: ${compPeriodo}
Comparar por: ${compararPor}
Empresas: ${empresas.join(", ") || "—"}
Marketplaces: ${marketplaces.join(", ") || "—"}`
    );
  }

  function clearFilters() {
    setResultado("Hoje");
    setComparado("Ontem");
    setMarketplaces([]);
    setEmpresas([]);
    setCompararPor("Somatória");
    setResultadoRange({});
    setComparadoRange({});
    setShowResultadoCalendar(false);
    setShowComparadoCalendar(false);
  }

  return (
    <div className="flex flex-col gap-2 p-2 rounded-lg">
      {/* TOPO: Somatória / Empresas / Marketplaces */}
      <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:justify-center md:gap-3">
        <div className="min-w-0">
          <SingleSelect
            value={compararPor}
            onChange={(v) => setCompararPor(v as "Média" | "Somatória")}
            options={[
              { value: "Somatória", label: "Somatória" },
              { value: "Média", label: "Média" },
            ]}
            minWidthClass="w-full min-w-0"
            placement="bottom"
          />
        </div>

        <div className="min-w-0">
          <EmpresasMultiSelect
            value={empresas}
            onChange={setEmpresas}
            isMobile={isMobile}
          />
        </div>

        <div className="min-w-0">
          <MarketplacesMultiSelect
            value={marketplaces}
            onChange={setMarketplaces}
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* SEGUNDA LINHA: Resultado / Comparado + botões */}
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-row md:flex-wrap md:items-end md:justify-center md:gap-3">
        {/* Resultado de */}
        <div className="relative flex flex-col gap-1 min-w-0 md:flex-row md:items-center md:gap-2">
          <label className="text-[11px] font-medium text-text-secondary md:whitespace-nowrap">
            Resultado de
          </label>
          <div className="flex-1">
            <SingleSelect
              value={resultado}
              onChange={handleResultadoChange}
              options={Object.keys(periodOptions).map((k) => ({
                value: k,
                label: k,
              }))}
              className="md:min-w-[160px]"
              renderLabel={() => <>{resultadoLabel}</>}
              onOptionClick={(opt) => {
                if (opt.value === "Período personalizado") {
                  setResultado(opt.value);
                  setShowResultadoCalendar(true);
                  return true;
                }
              }}
              minWidthClass="w-full min-w-0"
              placement="bottom"
            />
            <DateRangePopover
              open={showResultadoCalendar}
              onClose={() => setShowResultadoCalendar(false)}
              value={resultadoRange}
              onApply={(range) => setResultadoRange(range)}
              title="Período personalizado (Resultado de)"
              placement="bottom"
            />
          </div>
        </div>

        {/* Comparado com */}
        <div className="relative flex flex-col gap-1 min-w-0 md:flex-row md:items-center md:gap-2">
          <label className="text-[11px] font-medium text-text-secondary md:whitespace-nowrap">
            Comparado com
          </label>

          <div className="flex-1">
            <SingleSelect
              value={comparado}
              onChange={setComparado}
              options={(periodOptions[resultado] ?? []).map((opt) => ({
                value: opt,
                label: opt,
              }))}
              className="md:min-w-[160px]"
              renderLabel={() => <>{comparadoLabel}</>}
              onOptionClick={(opt) => {
                if (opt.value === "Período personalizado") {
                  setComparado(opt.value);
                  setShowComparadoCalendar(true);
                  return true;
                }
              }}
              minWidthClass="w-full min-w-0"
              placement="bottom"
            />
            <DateRangePopover
              open={showComparadoCalendar}
              onClose={() => setShowComparadoCalendar(false)}
              value={comparadoRange}
              onApply={(range) => setComparadoRange(range)}
              title="Período personalizado (Comparado com)"
              placement="bottom"
            />
          </div>

          {/* Botões desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={applyFilters}
              className="px-4 py-1 rounded-md bg-[#10b97c] hover:bg-[#0d9d6b] text-white text-[11px] font-medium h-7"
            >
              Aplicar
            </button>
            <button
              onClick={clearFilters}
              className="h-7 aspect-square flex items-center justify-center rounded-md border border-border-dark hover:bg-muted"
              aria-label="Limpar filtros"
              title="Limpar filtros"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Botões mobile */}
      <div className="flex items-center justify-center gap-2 md:hidden">
        <button
          onClick={applyFilters}
          className="px-4 py-1 rounded-md bg-[#10b97c] hover:bg-[#0d9d6b] text-white text-[11px] font-medium h-7"
        >
          Aplicar
        </button>
        <button
          onClick={clearFilters}
          className="h-7 aspect-square flex items-center justify-center rounded-md border border-border-dark hover:bg-muted"
          aria-label="Limpar filtros"
          title="Limpar filtros"
          type="button"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
