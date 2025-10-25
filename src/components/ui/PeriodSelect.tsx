"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";

/** Tipo de intervalo (YYYY-MM-DD) */
export interface DateRange {
  start: string;
  end: string;
}

interface PeriodSelectProps {
  label: string;
  value: DateRange | null;
  onChange: (range: DateRange | null) => void;
}

/* ===== Helpers de data ===== */

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function addDays(d: Date, delta: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + delta);
  return nd;
}
function startOfWeek(d: Date) {
  // Semana iniciando na segunda-feira (BR)
  const nd = new Date(d);
  const day = nd.getDay(); // dom=0..sab=6
  const diff = (day === 0 ? -6 : 1 - day); // leva até segunda
  nd.setDate(nd.getDate() + diff);
  nd.setHours(0, 0, 0, 0);
  return nd;
}
function endOfWeek(d: Date) {
  const start = startOfWeek(d);
  return addDays(start, 6);
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function shiftWeeks(w: number) {
  const today = new Date();
  const base = addDays(today, w * 7);
  const s = startOfWeek(base);
  const e = endOfWeek(base);
  return { start: toISO(s), end: toISO(e) };
}
function shiftMonths(m: number) {
  const today = new Date();
  const base = new Date(today.getFullYear(), today.getMonth() + m, 1);
  const s = startOfMonth(base);
  const e = endOfMonth(base);
  return { start: toISO(s), end: toISO(e) };
}
function todayRange() {
  const t = new Date();
  const iso = toISO(t);
  return { start: iso, end: iso };
}
function yesterdayRange() {
  const y = addDays(new Date(), -1);
  const iso = toISO(y);
  return { start: iso, end: iso };
}
function lastNDays(n: number, inclusiveOfYesterday = true) {
  // ex.: n=7 => [ontem-6 .. ontem] ou [hoje-n+1 .. hoje]
  const end = inclusiveOfYesterday ? addDays(new Date(), -1) : new Date();
  const start = addDays(end, -(n - 1));
  return { start: toISO(start), end: toISO(end) };
}

const fieldBase =
  "h-10 w-full px-3 border border-border-dark rounded-md bg-background text-text text-left focus:ring-primary focus:border-primary";

/** Presets para um único intervalo (valor do próprio controle) */
function usePresets() {
  return useMemo(() => {
    const HOJE = todayRange();
    const ONTEM = yesterdayRange();
    const ESTA_SEMANA = shiftWeeks(0);
    const SEMANA_PASSADA = shiftWeeks(-1);
    const ESTE_MES = shiftMonths(0);
    const MES_PASSADO = shiftMonths(-1);

    return [
      {
        group: "Hoje / Ontem",
        options: [
          { label: "Hoje", range: HOJE },
          { label: "Ontem", range: ONTEM },
          { label: "Últimos 7 dias (até ontem)", range: lastNDays(7, true) },
          { label: "Últimos 15 dias (até ontem)", range: lastNDays(15, true) },
          { label: "Últimos 30 dias (até ontem)", range: lastNDays(30, true) },
          { label: "Período personalizado", range: null },
        ],
      },
      {
        group: "Semanas",
        options: [
          { label: "Esta semana", range: ESTA_SEMANA },
          { label: "Semana passada", range: SEMANA_PASSADA },
          { label: "Últimas 4 semanas (até semana passada)", range: combineWeeks(-4, -1) },
          { label: "Últimas 8 semanas (até semana passada)", range: combineWeeks(-8, -1) },
          { label: "Últimas 12 semanas (até semana passada)", range: combineWeeks(-12, -1) },
          { label: "Período personalizado", range: null },
        ],
      },
      {
        group: "Meses",
        options: [
          { label: "Este mês", range: ESTE_MES },
          { label: "Mês passado", range: MES_PASSADO },
          { label: "Últimos 2 meses (até mês passado)", range: combineMonths(-2, -1) },
          { label: "Últimos 4 meses (até mês passado)", range: combineMonths(-4, -1) },
          { label: "Últimos 6 meses (até mês passado)", range: combineMonths(-6, -1) },
          { label: "Período personalizado", range: null },
        ],
      },
    ];
  }, []);
}

/** Combina semanas entre offsets (ex.: -4..-1) em um único range contínuo */
function combineWeeks(fromOffset: number, toOffset: number): DateRange {
  const start = shiftWeeks(fromOffset).start;
  const end = shiftWeeks(toOffset).end;
  return { start, end };
}
/** Combina meses entre offsets (ex.: -4..-1) em um único range contínuo */
function combineMonths(fromOffset: number, toOffset: number): DateRange {
  const start = shiftMonths(fromOffset).start;
  const end = shiftMonths(toOffset).end;
  return { start, end };
}

export function PeriodSelect({ label, value, onChange }: PeriodSelectProps) {
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [custom, setCustom] = useState<DateRange | null>(value ?? null);
  const presets = usePresets();

  function applyCustom() {
    if (custom?.start && custom?.end) {
      onChange(custom);
      setCustomOpen(false);
      setOpen(false);
    }
  }

  const buttonText = value ? `${value.start} – ${value.end}` : "Selecione o período";

  return (
    <div className="relative">
      <label className="block text-xs text-text-secondary mb-1">{label}</label>
      <button
        type="button"
        className={fieldBase}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="w-full flex items-center justify-between">
          <span className="truncate">{buttonText}</span>
          <ChevronDown className="w-4 h-4 opacity-70" />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[24rem] rounded-lg border border-border-dark bg-card shadow-lg p-2 max-h-[22rem] overflow-y-auto">
          {presets.map((group) => (
            <div key={group.group} className="mb-2">
              <div className="text-xs font-semibold text-text-secondary px-2 mb-1">
                {group.group}
              </div>
              {group.options.map((opt) => (
                <button
                  key={opt.label}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-muted text-sm"
                  onClick={() => {
                    if (opt.range) {
                      onChange(opt.range);
                      setOpen(false);
                    } else {
                      // Período personalizado
                      setCustom(value ?? null);
                      setCustomOpen(true);
                    }
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ))}

          {/* Período personalizado inline */}
          {customOpen && (
            <div className="mt-2 border border-border-dark rounded p-3">
              <div className="text-xs font-semibold text-text-secondary mb-2">
                Período personalizado
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="h-10 w-full px-3 border border-border-dark rounded-md bg-background text-text"
                  value={custom?.start ?? ""}
                  onChange={(e) =>
                    setCustom((prev) => ({ ...(prev ?? { start: "", end: "" }), start: e.target.value }))
                  }
                />
                <input
                  type="date"
                  className="h-10 w-full px-3 border border-border-dark rounded-md bg-background text-text"
                  value={custom?.end ?? ""}
                  onChange={(e) =>
                    setCustom((prev) => ({ ...(prev ?? { start: "", end: "" }), end: e.target.value }))
                  }
                />
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button className="h-8 px-3" onClick={() => setCustomOpen(false)}>
                  Cancelar
                </Button>
                <Button className="h-8 px-3" onClick={applyCustom}>
                  Aplicar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ===== Pares rápidos: aplica rangeA e rangeB de uma vez ===== */

export interface QuickPair {
  label: string;
  a: DateRange; // Resultado de
  b: DateRange; // Comparado com
}

export function quickPairs(): QuickPair[] {
  const HOJE = todayRange();
  const ONTEM = yesterdayRange();

  // Ontem - N dias anteriores (contíguo até ontem)
  const ONTEM_7_ANTES = lastNDays(8, true);  // 8 inclui ontem -> start .. ontem
  const JUST_7_ANTES = lastNDays(7, true);   // só 7 dias até ontem

  const ESTA_SEMANA = shiftWeeks(0);
  const SEMANA_PASSADA = shiftWeeks(-1);
  const SEM_4_ANT = combineWeeks(-4, -1);
  const SEM_8_ANT = combineWeeks(-8, -1);
  const SEM_12_ANT = combineWeeks(-12, -1);

  const ESTE_MES = shiftMonths(0);
  const MES_PASSADO = shiftMonths(-1);
  const MES_2_ANT = combineMonths(-2, -1);
  const MES_4_ANT = combineMonths(-4, -1);
  const MES_6_ANT = combineMonths(-6, -1);

  return [
    { label: "Hoje – Ontem", a: HOJE, b: ONTEM },
    { label: "Ontem – 7 dias anteriores", a: ONTEM, b: JUST_7_ANTES },
    { label: "Ontem – 15 dias anteriores", a: ONTEM, b: lastNDays(15, true) },
    { label: "Ontem – 30 dias anteriores", a: ONTEM, b: lastNDays(30, true) },

    { label: "Esta semana – Semana passada", a: ESTA_SEMANA, b: SEMANA_PASSADA },
    { label: "Esta semana – 4 semanas anteriores", a: ESTA_SEMANA, b: SEM_4_ANT },
    { label: "Esta semana – 8 semanas anteriores", a: ESTA_SEMANA, b: SEM_8_ANT },
    { label: "Esta semana – 12 semanas anteriores", a: ESTA_SEMANA, b: SEM_12_ANT },

    { label: "Semana passada – 4 semanas anteriores", a: SEMANA_PASSADA, b: SEM_4_ANT },
    { label: "Semana passada – 8 semanas anteriores", a: SEMANA_PASSADA, b: SEM_8_ANT },
    { label: "Semana passada – 12 semanas anteriores", a: SEMANA_PASSADA, b: SEM_12_ANT },

    { label: "Este mês – Mês passado", a: ESTE_MES, b: MES_PASSADO },
    { label: "Este mês – 2 meses anteriores", a: ESTE_MES, b: MES_2_ANT },
    { label: "Este mês – 4 meses anteriores", a: ESTE_MES, b: MES_4_ANT },
    { label: "Este mês – 6 meses anteriores", a: ESTE_MES, b: MES_6_ANT },

    { label: "Mês passado – 2 meses anteriores", a: MES_PASSADO, b: MES_2_ANT },
    { label: "Mês passado – 4 meses anteriores", a: MES_PASSADO, b: MES_4_ANT },
    { label: "Mês passado – 6 meses anteriores", a: MES_PASSADO, b: MES_6_ANT },
  ];
}
