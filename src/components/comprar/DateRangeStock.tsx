"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { DateRangePopover } from "@/components/dashboard/DateRangePopover";
import { Range } from "@/components/dashboard/DateRangePicker";
import { useOutsideClose } from "@/hooks/useOutsideClose";
import { useIsMobile } from "@/hooks/useIsMobile";

type Period = "30d" | "60d" | "90d" | "1y" | "custom";

const periodLabels: { [key in Period]: string } = {
  "30d": "Últimos 30 dias",
  "60d": "Últimos 60 dias",
  "90d": "Últimos 90 dias",
  "1y": "Último ano",
  custom: "Personalizado",
};

function formatDate(d: Date) {
  return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function getRangeFromPeriod(period: Period): Range {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case "30d":
      start.setDate(end.getDate() - 30);
      break;
    case "60d":
      start.setDate(end.getDate() - 60);
      break;
    case "90d":
      start.setDate(end.getDate() - 90);
      break;
    case "1y":
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      return { start: undefined, end: undefined };
  }

  const toYMD = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toYMD(start), end: toYMD(end) };
}

export const DateRangeStock = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("30d");
  const [range, setRange] = useState<Range>(getRangeFromPeriod("30d"));

  const isMobile = useIsMobile();
  const dropdownRef = useOutsideClose<HTMLDivElement>(isOpen && !isMobile, () =>
    setIsOpen(false)
  );

  const handlePeriodSelect = (p: Period) => {
    if (p === "custom") {
      setIsCustomRangeOpen(true);
    } else {
      setPeriod(p);
      setRange(getRangeFromPeriod(p));
    }
    setIsOpen(false);
  };

  const handleCustomRangeApply = (newRange: Range) => {
    setRange(newRange);
  };

  const handleCustomRangeClose = () => {
    setIsCustomRangeOpen(false);
    if (range.start && range.end) {
      setPeriod("custom");
    }
  };

  const displayRange = () => {
    if (range.start && range.end) {
      const startDate = new Date(range.start);
      const endDate = new Date(range.end);
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return "Selecione um período";
  };

  const displayLabel = () => {
    if (period === "custom") {
      if (range.start && range.end) {
        const start = new Date(range.start);
        const end = new Date(range.end);
        return `${start.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        })} - ${end.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        })}`;
      }
      return "Personalizado";
    }
    return periodLabels[period];
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border border-border-dark text-black bg-white text-sm rounded-md px-3 sm:px-4 py-1.5 flex items-center gap-2 transition w-full sm:w-auto"
      >
        <CalendarDays size={18} className="flex-shrink-0" />

        <span className="font-medium whitespace-nowrap">
          Período de análise: {displayLabel()}
        </span>
      </button>

      <div className="text-sm text-gray-500 mt-1">{displayRange()}</div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-48 bg-card border border-border-dark  rounded-md shadow-lg z-10">
          {Object.entries(periodLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handlePeriodSelect(key as Period)}
              className="block w-full text-left px-4 py-2 text-sm text- hover:bg-background"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <DateRangePopover
        open={isCustomRangeOpen}
        onClose={handleCustomRangeClose}
        onApply={handleCustomRangeApply}
        value={range}
      />
    </div>
  );
};
