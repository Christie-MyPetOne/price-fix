"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const fieldBase =
  "bg-card h-8 w-full px-3 border border-border-dark rounded-md bg-background text-text focus:ring-primary focus:border-primary";

const periodOptions: Record<string, string[]> = {
  Hoje: ["Ontem"],
  Ontem: ["7 dias anteriores", "15 dias anteriores", "30 dias anteriores", "Período personalizado"],
  "Esta semana": ["Semana passada", "4 semanas anteriores", "8 semanas anteriores", "12 semanas anteriores", "Período personalizado"],
  "Semana passada": ["4 semanas anteriores", "8 semanas anteriores", "12 semanas anteriores", "Período personalizado"],
  "Este mês": ["Mês passado", "2 meses anteriores", "4 meses anteriores", "6 meses anteriores", "Período personalizado"],
  "Mês passado": ["2 meses anteriores", "4 meses anteriores", "6 meses anteriores", "Período personalizado"],
  "Período personalizado": ["Período personalizado"],
};

/* ========= utils ========= */
function formatDate(d?: string) {
  if (!d) return "";
  const [yyyy, mm, dd] = d.split("-");
  return `${dd}/${mm}/${yyyy}`;
}
function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function parseYMD(ymd?: string) {
  if (!ymd) return null;
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function isWithin(d: Date, a?: string, b?: string) {
  if (!a || !b) return false;
  const da = parseYMD(a)!, db = parseYMD(b)!, dx = d;
  const min = Math.min(da.getTime(), db.getTime());
  const max = Math.max(da.getTime(), db.getTime());
  return dx.getTime() >= min && dx.getTime() <= max;
}
function sameDay(d: Date, ymd?: string) {
  if (!ymd) return false;
  const p = parseYMD(ymd)!;
  return d.getFullYear() === p.getFullYear() && d.getMonth() === p.getMonth() && d.getDate() === p.getDate();
}

/* ============ Hook: fechar ao clicar fora / Esc ============ */
function useOutsideClose<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent | TouchEvent) {
      if (!ref.current) return;
      const target = e.target as Node;
      if (!ref.current.contains(target)) onClose();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("touchstart", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("touchstart", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return ref;
}

/* ============ Calendário de intervalo (um único calendário) ============ */
function DateRangeCalendar({
  value,
  onChange,
}: {
  value?: { start?: string; end?: string };
  onChange: (next: { start?: string; end?: string }) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(() => (value?.start ? parseYMD(value.start)!.getFullYear() : today.getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (value?.start ? parseYMD(value.start)!.getMonth() : today.getMonth())); // 0..11
  const [anchor, setAnchor] = useState<string | undefined>(value?.start);
  const [rangeEnd, setRangeEnd] = useState<string | undefined>(value?.end);

  useEffect(() => {
    setAnchor(value?.start);
    setRangeEnd(value?.end);
  }, [value?.start, value?.end]);

  function prevMonth() {
    const d = new Date(viewYear, viewMonth, 1);
    d.setMonth(d.getMonth() - 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }
  function nextMonth() {
    const d = new Date(viewYear, viewMonth, 1);
    d.setMonth(d.getMonth() + 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstDay.getDay(); // 0=Dom
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const grid: (Date | null)[] = [];
  // preencher vazios até o primeiro dia (ajustando para Dom->0)
  for (let i = 0; i < startWeekday; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(viewYear, viewMonth, d));

  function clickDay(d: Date) {
    const key = toKey(d.getFullYear(), d.getMonth() + 1, d.getDate());
    if (!anchor || (anchor && rangeEnd)) {
      // primeira escolha (ou reinicia)
      setAnchor(key);
      setRangeEnd(undefined);
      onChange({ start: key, end: undefined });
    } else {
      // segunda escolha
      // se clicou antes do anchor, invertê-las
      const a = parseYMD(anchor)!.getTime();
      const b = d.getTime();
      const start = a <= b ? anchor : key;
      const end = a <= b ? key : anchor;
      setAnchor(start);
      setRangeEnd(end);
      onChange({ start, end });
    }
  }

  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(viewYear, viewMonth, 1));
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]; // Dom..Sáb

  return (
    <div className="w-[320px]">
      <div className="flex items-center justify-between px-2 py-1">
        <button onClick={prevMonth} className="h-8 w-8 rounded-md hover:bg-muted" type="button" aria-label="Mês anterior">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-sm font-medium capitalize">{monthLabel}</div>
        <button onClick={nextMonth} className="h-8 w-8 rounded-md hover:bg-muted" type="button" aria-label="Próximo mês">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 px-2 pb-2">
        {weekDays.map((d) => (
          <div key={d} className="text-[11px] text-text-secondary text-center py-1">
            {d}
          </div>
        ))}

        {grid.map((date, idx) => {
          if (!date) return <div key={`e-${idx}`} />;
          const isStart = sameDay(date, anchor);
          const isEnd = sameDay(date, rangeEnd);
          const inRange = isWithin(date, anchor, rangeEnd);
          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => clickDay(date)}
              className={[
                "h-8 rounded-md text-sm text-center",
                inRange ? "bg-primary/10" : "hover:bg-muted",
                isStart || isEnd ? "ring-2 ring-primary font-medium" : "",
                isToday ? "border border-border-dark" : "",
              ].join(" ")}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs px-2 pb-2">
        <div>
          {anchor && !rangeEnd && <span>Início: {formatDate(anchor)}</span>}
          {anchor && rangeEnd && (
            <span>
              {formatDate(anchor)} – {formatDate(rangeEnd)}
            </span>
          )}
        </div>
        <button
          type="button"
          className="px-2 h-7 rounded border border-border-dark hover:bg-muted"
          onClick={() => {
            setAnchor(undefined);
            setRangeEnd(undefined);
            onChange({ start: undefined, end: undefined });
          }}
        >
          Limpar seleção
        </button>
      </div>
    </div>
  );
}

/* ============ Popover de Período (usa o calendário único) ============ */
function DateRangePopover({
  open,
  onClose,
  value,
  onApply,
  title = "Selecionar período",
  placement = "bottom",
}: {
  open: boolean;
  onClose: () => void;
  value?: { start?: string; end?: string };
  onApply: (range: { start?: string; end?: string }) => void;
  title?: string;
  /** "bottom" ou "right" */
  placement?: "bottom" | "right";
}) {
  const ref = useOutsideClose<HTMLDivElement>(open, onClose);
  if (!open) return null;

  // posicionamento consistente
  const positionClass =
    placement === "right"
      ? "left-[calc(100%+8px)] top-0"
      : "left-0 top-[calc(100%+8px)]";

  return (
    <div
      ref={ref}
      className={`absolute ${positionClass} z-50 rounded-lg border border-border-dark bg-card shadow-lg p-3`}
    >
      <div className="text-sm font-medium mb-2">{title}</div>
      <DateRangeCalendar value={value} onChange={onApply} />
      <div className="flex justify-end gap-2 mt-2">
        <button className="h-8 px-3 rounded-md border border-border-dark text-sm" onClick={onClose} type="button">
          Fechar
        </button>
        <button
          className="h-8 px-3 rounded-md bg-primary text-white text-sm disabled:opacity-50"
          onClick={onClose}
          disabled={!value?.start || !value?.end}
          type="button"
        >
          OK
        </button>
      </div>
    </div>
  );
}

/* ============ SingleSelect (dropdown estilizado) ============ */
type SingleSelectOption = { value: string; label: string };

function SingleSelect({
  value,
  onChange,
  options,
  placeholder = "Selecione...",
  className = "",
  minWidthClass = "min-w-[220px]",
  onOptionClick,
  renderLabel,
  placement = "bottom",
}: {
  value?: string;
  onChange: (val: string) => void;
  options: SingleSelectOption[];
  placeholder?: string;
  className?: string;
  minWidthClass?: string;
  onOptionClick?: (opt: SingleSelectOption) => boolean | void;
  renderLabel?: (current?: SingleSelectOption) => React.ReactNode;
  placement?: "bottom" | "right";
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const panelRef = useOutsideClose<HTMLDivElement>(open, () => setOpen(false));

  const positionClass =
    placement === "right"
      ? "left-[calc(100%+8px)] top-0"
      : "left-0 top-[calc(100%+8px)]";

  return (
    <div className={`relative ${minWidthClass}`}>
      <button
        type="button"
        className={`${fieldBase} flex items-center justify-between ${className}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate">
          {renderLabel ? renderLabel(selected) : selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 opacity-70" />
      </button>

      {open && (
        <div
          ref={panelRef}
          className={`absolute ${positionClass} z-50 w-full rounded-lg border border-border-dark bg-card shadow-lg p-1.5`}
        >
          <div className="py-1 max-h-64 overflow-auto">
            {options.map((opt) => {
              const active = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm flex items-center justify-between"
                  onClick={() => {
                    const preventClose = onOptionClick?.(opt);
                    if (!preventClose) {
                      onChange(opt.value);
                      setOpen(false);
                    }
                  }}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && <Check className="w-4 h-4 opacity-80" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ Multi-selects (iguais aos anteriores) ============ */
function EmpresasMultiSelect({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const panelRef = useOutsideClose<HTMLDivElement>(open, () => setOpen(false));

  const options = [
    { id: "conta1", label: "Conta 1" },
    { id: "conta2", label: "Conta 2" },
    { id: "conta3", label: "Conta 3" },
  ];
  const allSelected = value.length === options.length;
  const someSelected = value.length > 0 && !allSelected;

  const buttonText =
    value.length === 0 ? "Selecione empresas" : value.length === 1 ? options.find((o) => o.id === value[0])?.label : `${value.length} selecionadas`;

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }
  function toggleAll() {
    onChange(allSelected ? [] : options.map((o) => o.id));
  }

  return (
    <div className="relative">
      <button type="button" className={`${fieldBase} min-w-[220px] flex items-center justify-between`} onClick={() => setOpen((o) => !o)}>
        <span className="truncate">{buttonText}</span>
        <ChevronDown className="w-4 h-4 opacity-70" />
      </button>

      {open && (
        <div ref={panelRef} className="absolute left-0 top-[calc(100%+8px)] z-50 w-full rounded-lg border border-border-dark bg-card shadow-lg p-2">
          <button type="button" className=" w-full text-left px-3 py-2 rounded hover:bg-muted text-sm flex items-center gap-2" onClick={toggleAll}>
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

          <div className="py-1 max-h-64 overflow-auto">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm flex items-center gap-2"
                onClick={() => toggle(opt.id)}
              >
                <input type="checkbox" className="accent-primary" readOnly checked={value.includes(opt.id)} />
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end p-2">
            <button className="h-8 px-3 rounded-md bg-primary text-white text-sm" onClick={() => setOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MarketplacesMultiSelect({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const panelRef = useOutsideClose<HTMLDivElement>(open, () => setOpen(false));

  const options = [
    { id: "shopee", label: "Shopee" },
    { id: "mercado_livre", label: "Mercado Livre" },
    { id: "amazon", label: "Amazon" },
  ];
  const allSelected = value.length === options.length;
  const someSelected = value.length > 0 && !allSelected;

  const buttonText =
    value.length === 0 ? "Selecione marketplaces" : value.length === 1 ? options.find((o) => o.id === value[0])?.label : `${value.length} selecionados`;

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }
  function toggleAll() {
    onChange(allSelected ? [] : options.map((o) => o.id));
  }

  return (
    <div className="relative">
      <button type="button" className={`${fieldBase} min-w-[220px] flex items-center justify-between`} onClick={() => setOpen((o) => !o)}>
        <span className="truncate">{buttonText}</span>
        <ChevronDown className="w-4 h-4 opacity-70" />
      </button>

      {open && (
        <div ref={panelRef} className="absolute left-0 top-[calc(100%+8px)] z-50 w-full rounded-lg border border-border-dark bg-card shadow-lg p-2">
          <button type="button" className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm flex items-center gap-2" onClick={toggleAll}>
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

          <div className="py-1 max-h-64 overflow-auto">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm flex items-center gap-2"
                onClick={() => toggle(opt.id)}
              >
                <input type="checkbox" className="accent-primary" readOnly checked={value.includes(opt.id)} />
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end p-2">
            <button className="h-8 px-3 rounded-md bg-primary text-white text-sm" onClick={() => setOpen(false)}>
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
  const [empresas, setEmpresas] = useState<string[]>([]);
  const [compararPor, setCompararPor] = useState<"Média" | "Somatória">("Somatória");

  const [resultadoRange, setResultadoRange] = useState<{ start?: string; end?: string }>({});
  const [comparadoRange, setComparadoRange] = useState<{ start?: string; end?: string }>({});
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
    if (resultado === "Período personalizado" && resultadoRange.start && resultadoRange.end) {
      return `${formatDate(resultadoRange.start)} – ${formatDate(resultadoRange.end)}`;
    }
    return resultado;
  }, [resultado, resultadoRange.start, resultadoRange.end]);

  const comparadoLabel = useMemo(() => {
    if (comparado === "Período personalizado" && comparadoRange.start && comparadoRange.end) {
      return `${formatDate(comparadoRange.start)} – ${formatDate(comparadoRange.end)}`;
    }
    return comparado;
  }, [comparado, comparadoRange.start, comparadoRange.end]);

  function applyFilters() {
    const resPeriodo =
      resultado === "Período personalizado" && resultadoRange.start && resultadoRange.end
        ? `${formatDate(resultadoRange.start)} – ${formatDate(resultadoRange.end)}`
        : resultado;

    const compPeriodo =
      comparado === "Período personalizado" && comparadoRange.start && comparadoRange.end
        ? `${formatDate(comparadoRange.start)} – ${formatDate(comparadoRange.end)}`
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
    <div className="justify-center flex gap-4 p-4 rounded-lg flex-wrap">
      {/* Comparar por */}
      <div className="flex flex-col h-8">
        <SingleSelect
          value={compararPor}
          onChange={(v) => setCompararPor(v as "Média" | "Somatória")}
          options={[
            { value: "Somatória", label: "Somatória" },
            { value: "Média", label: "Média" },
          ]}
          minWidthClass="min-w-[180px]"
          placement="bottom"
        />
      </div>

      {/* Empresas */}
      <div className="flex flex-col">
        <EmpresasMultiSelect value={empresas} onChange={setEmpresas} />
      </div>

      {/* Marketplaces */}
      <div className="flex flex-col">
        <MarketplacesMultiSelect value={marketplaces} onChange={setMarketplaces} />
      </div>

      {/* Linha de filtros + botões */}
      <div className="w-full flex flex-col justify-center md:flex-row md:items-end gap-3 md:gap-4">
        {/* Resultado de */}
        <div className="relative flex flex-col md:flex-row md:items-center w-full md:w-auto gap-1">
          <label className="text-sm font-medium text-text-secondary md:w-32 shrink-0">Resultado de</label>
          <SingleSelect
            value={resultado}
            onChange={handleResultadoChange}
            options={Object.keys(periodOptions).map((k) => ({ value: k, label: k }))}
            className="md:min-w-[220px]"
            renderLabel={() => <>{resultadoLabel}</>}
            onOptionClick={(opt) => {
              if (opt.value === "Período personalizado") {
                setResultado(opt.value);
                setShowResultadoCalendar(true);
                return true;
              }
            }}
            placement="bottom" 
          />
          <DateRangePopover
            open={showResultadoCalendar}
            onClose={() => setShowResultadoCalendar(false)}
            value={resultadoRange}
            onApply={(range) => setResultadoRange(range)}
            title="Período personalizado (Resultado de)"
            placement="bottom" /* troque para "right" para abrir ao lado */
          />
        </div>

        {/* Comparado com */}
        <div className="relative flex flex-col md:flex-row md:items-center w-full md:w-auto gap-1">
          <label className="text-sm font-medium text-text-secondary md:w-32 shrink-0">Comparado com</label>
          <SingleSelect
            value={comparado}
            onChange={setComparado}
            options={(periodOptions[resultado] ?? []).map((opt) => ({ value: opt, label: opt }))}
            className="md:min-w-[220px]"
            renderLabel={() => <>{comparadoLabel}</>}
            onOptionClick={(opt) => {
              if (opt.value === "Período personalizado") {
                setComparado(opt.value);
                setShowComparadoCalendar(true);
                return true;
              }
            }}
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

        {/* Botões */}
        <div className="flex items-center gap-2">
          <button onClick={applyFilters} className="px-6 py-1 rounded-md bg-[#10b97c] hover:bg-[#0d9d6b] text-white font-medium">
            Aplicar
          </button>
          <button
            onClick={clearFilters}
            className="h-8 aspect-square flex items-center justify-center rounded-md border border-border-dark hover:bg-muted"
            aria-label="Limpar filtros"
            title="Limpar filtros"
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
