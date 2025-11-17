"use client";

import React from "react";
import DateRangePicker, { Range } from "@/components/dashboard/DateRangePicker";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useOutsideClose } from "@/hooks/useOutsideClose";

type Props = {
  open: boolean;
  onClose: () => void;
  value?: Range;
  onApply: (range: Range) => void;
  title?: string;
  placement?: "bottom" | "right";
};

export function DateRangePopover({
  open,
  onClose,
  value,
  onApply,
  title = "Selecionar período",
  placement = "bottom",
}: Props) {
  const isMobile = useIsMobile();
  const ref = useOutsideClose<HTMLDivElement>(open && !isMobile, onClose);

  if (!open) return null;

  const positionClass =
    placement === "right"
      ? "left-[calc(100%+8px)] top-0"
      : "left-0 top-[calc(100%+8px)]";

  return (
    <div
      ref={ref}
      className={`absolute ${positionClass} z-50 rounded-lg border border-border-dark bg-card shadow-lg p-2`}
    >
      <div className="text-xs font-medium mb-2">{title}</div>

      <DateRangePicker value={value} onChange={onApply} />

      <div className="flex justify-end gap-2 mt-2">
        <button
          className="h-7 px-3 rounded-md border border-border-dark text-xs"
          onClick={onClose}
          type="button"
        >
          Fechar
        </button>
        <button
          className="h-7 px-3 rounded-md bg-primary text-white text-xs disabled:opacity-50"
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
