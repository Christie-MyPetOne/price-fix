"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Range = {
  start?: string;
  end?: string;
};

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
  const da = parseYMD(a)!;
  const db = parseYMD(b)!;
  const dx = d;

  const min = Math.min(da.getTime(), db.getTime());
  const max = Math.max(da.getTime(), db.getTime());

  const dayStart = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  return (
    dayStart(dx) >= dayStart(new Date(min)) &&
    dayStart(dx) <= dayStart(new Date(max))
  );
}

function sameDay(d: Date, ymd?: string) {
  if (!ymd) return false;
  const p = parseYMD(ymd)!;
  return (
    d.getFullYear() === p.getFullYear() &&
    d.getMonth() === p.getMonth() &&
    d.getDate() === p.getDate()
  );
}

/**
 * Componente de calendário de intervalo de datas (range picker)
 * Controlado via props `value` e `onChange`.
 */
export default function DateRangePicker({
  value,
  onChange,
}: {
  value?: Range;
  onChange: (next: Range) => void;
}) {
  const today = new Date();

  const [viewYear, setViewYear] = useState(() =>
    value?.start ? parseYMD(value.start)!.getFullYear() : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(() =>
    value?.start ? parseYMD(value.start)!.getMonth() : today.getMonth()
  );
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
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const grid: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push(new Date(viewYear, viewMonth, d));
  }

  function clickDay(d: Date) {
    const key = toKey(d.getFullYear(), d.getMonth() + 1, d.getDate());

    // 1º clique: ancora / 3º clique: reinicia
    if (!anchor || (anchor && rangeEnd)) {
      setAnchor(key);
      setRangeEnd(undefined);
      onChange({ start: key, end: undefined });
      return;
    }

    // 2º clique: define o fim do range
    const a = parseYMD(anchor)!.getTime();
    const b = d.getTime();
    const start = a <= b ? anchor : key;
    const end = a <= b ? key : anchor;

    setAnchor(start);
    setRangeEnd(end);
    onChange({ start, end });
  }

  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(viewYear, viewMonth, 1));

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <div className="w-[280px]">
      {/* Cabeçalho do mês */}
      <div className="flex items-center justify-between px-2 py-1">
        <button
          onClick={prevMonth}
          className="h-7 w-7 rounded-md hover:bg-muted"
          type="button"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-xs font-medium capitalize">{monthLabel}</div>
        <button
          onClick={nextMonth}
          className="h-7 w-7 rounded-md hover:bg-muted"
          type="button"
          aria-label="Próximo mês"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dias da semana + grid de dias */}
      <div className="grid grid-cols-7 gap-1 px-2 pb-2">
        {weekDays.map((d) => (
          <div
            key={d}
            className="text-[10px] text-text-secondary text-center py-1"
          >
            {d}
          </div>
        ))}

        {grid.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />;

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
                "h-7 rounded-md text-xs text-center",
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

      {/* Resumo do range + limpar */}
      <div className="flex items-center justify-between text-[11px] px-2 pb-2">
        <div className="truncate">
          {anchor && !rangeEnd && <span>Início: {formatDate(anchor)}</span>}
          {anchor && rangeEnd && (
            <span>
              {formatDate(anchor)} – {formatDate(rangeEnd)}
            </span>
          )}
        </div>
        <button
          type="button"
          className="px-2 h-7 rounded border border-border-dark hover:bg-muted text-xs"
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
