"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MargensChartProps } from "@/lib/types";
import { formatBRL } from "./lib/utils";

export default function MargensChart({
  buckets,
  legend,
  onChangeSelection,
  onEditRanges,
  selectedMargemIds = [],
}: MargensChartProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!buckets.length) return;

    const next: Record<string, boolean> = {};

    if (!selectedMargemIds.length) {
      for (const b of buckets) next[b.id] = true;
    } else {
      for (const b of buckets) next[b.id] = selectedMargemIds.includes(b.id);
    }

    setChecked((prev) => {
      const same =
        Object.keys(prev).length === Object.keys(next).length &&
        Object.keys(prev).every((k) => prev[k] === next[k]);

      return same ? prev : next;
    });
  }, [selectedMargemIds, buckets]);

  const maxOrders = useMemo(
    () => Math.max(...buckets.map((b) => b.orders), 1),
    [buckets]
  );

  useEffect(() => {
    const selectedIds = Object.entries(checked)
      .filter(([, v]) => v)
      .map(([k]) => k);
    onChangeSelection?.(selectedIds);
  }, [checked, onChangeSelection]);

  return (
    <div className="w-full bg-card rounded-lg shadow-sm border border-border-dark p-3 sm:p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pb-2">
            {buckets.map((b) => (
              <div key={b.id} className="text-xs sm:text-sm text-color-text">
                <span className="font-semibold">
                  {b.orders.toLocaleString("pt-BR")} pedidos
                </span>{" "}
                <span>{b.percent.toFixed(2)}%</span>
              </div>
            ))}
          </div>

          <div className="relative h-20 sm:h-24 mb-4">
            <div
              className="grid h-full gap-3"
              style={{
                gridTemplateColumns: `repeat(${buckets.length}, 1fr)`,
              }}
            >
              {buckets.map((b) => {
                const h = Math.max(10, Math.round((b.orders / maxOrders) * 80));
                const hex =
                  b.barHex ??
                  {
                    alta: "#1d4ed8",
                    media: "#059669",
                    baixa: "#f59e0b",
                    preju: "#dc2626",
                    incompleto: "#4b5563",
                  }[b.id] ??
                  "#3b82f6";

                return (
                  <div
                    key={b.id}
                    className="relative flex items-end justify-center"
                  >
                    <div
                      style={{
                        height: h,
                        width: "70%",
                        maxWidth: 60,
                        backgroundColor: hex,
                        borderRadius: 4,
                        opacity: checked[b.id] ? 1 : 0.35,
                        transition: "opacity 0.2s ease",
                      }}
                      aria-hidden
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {buckets.map((b) => (
              <div
                key={b.id}
                className="flex items-start gap-2 px-2 py-2 rounded-md border border-border-dark bg-background"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-primary"
                  checked={!!checked[b.id]}
                  onChange={(e) =>
                    setChecked((prev) => ({
                      ...prev,
                      [b.id]: e.target.checked,
                    }))
                  }
                />
                <div className="leading-tight">
                  <div className="text-sm font-medium text-color-text">
                    {b.titulo}
                  </div>
                  <div className="text-xs text-text-secondary">
                    Lucro: {formatBRL(b.lucro)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="w-full md:w-44 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-color-text">Margens</div>
            <button
              className="text-xs text-sky-600 hover:underline"
              onClick={onEditRanges}
              type="button"
            >
              Editar
            </button>
          </div>

          <ul className="space-y-1">
            {legend.map((l) => (
              <li key={l.label} className="flex justify-between text-sm">
                <span className="text-color-text">{l.label}</span>
                <span className="text-text-secondary">{l.range}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
