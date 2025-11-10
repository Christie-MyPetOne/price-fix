"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MargensChartProps } from "@/lib/types";

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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

    setChecked((prev) => {
      const next: Record<string, boolean> = {};

      if (!selectedMargemIds.length) {
        for (const b of buckets) next[b.id] = true;
      } else {
        for (const b of buckets) {
          next[b.id] = selectedMargemIds.includes(b.id);
        }
      }

      const changed =
        Object.keys(next).length !== Object.keys(prev).length ||
        Object.keys(next).some((key) => prev[key] !== next[key]);

      return changed ? next : prev;
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
      <div className="flex gap-6">
        <div className="flex-1">
          {/* Totais */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pb-2">
            {buckets.map((b) => (
              <div key={b.id} className="text-xs sm:text-sm text-color-text">
                <span className="font-semibold">
                  {b.orders.toLocaleString("pt-BR")} pedidos
                </span>{" "}
                <span>
                  {b.percent.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  %
                </span>
              </div>
            ))}
          </div>

          <div className="relative h-14 mb-3">
            <div
              className="grid h-full gap-4"
              style={{
                gridTemplateColumns: `repeat(${buckets.length}, minmax(0,1fr))`,
              }}
            >
              {buckets.map((b) => {
                const h = Math.max(8, Math.round((b.orders / maxOrders) * 56));
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
                        width: 60,
                        backgroundColor: hex,
                        borderRadius: 3,
                        opacity: checked[b.id] ? 1 : 0.3,
                        transition: "opacity 0.2s ease",
                      }}
                      aria-hidden
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {buckets.map((b) => (
              <div
                key={b.id}
                className="flex items-start gap-2 px-2 py-2 rounded-md border border-border-dark"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-gray-700"
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
                  <div className="text-xs text-color-text">
                    Lucro: {formatBRL(b.lucro)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="w-40 shrink-0 hidden md:block">
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
          <ul className="space-y-2">
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
