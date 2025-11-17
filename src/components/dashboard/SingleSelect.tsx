// src/components/dashboard/SingleSelect.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useOutsideClose } from "@/hooks/useOutsideClose";

export const fieldBase =
  "bg-card h-7 w-full px-2 border border-border-dark rounded-md bg-background text-text text-[11px] focus:ring-primary focus:border-primary";

export type SingleSelectOption = { value: string; label: string };

type Props = {
  value?: string;
  onChange: (val: string) => void;
  options: SingleSelectOption[];
  placeholder?: string;
  className?: string;
  minWidthClass?: string;
  onOptionClick?: (opt: SingleSelectOption) => boolean | void;
  renderLabel?: (current?: SingleSelectOption) => React.ReactNode;
  placement?: "bottom" | "right";
};

export function SingleSelect({
  value,
  onChange,
  options,
  placeholder = "Selecione...",
  className = "",
  minWidthClass = "min-w-[160px]",
  onOptionClick,
  renderLabel,
  placement = "bottom",
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const isMobile = useIsMobile();
  const panelRef = useOutsideClose<HTMLDivElement>(open && !isMobile, () =>
    setOpen(false)
  );

  const positionClass =
    placement === "right"
      ? "left-[calc(100%+8px)] top-0"
      : "left-0 top-[calc(100%+8px)]";

  const handleSelect = (opt: SingleSelectOption) => {
    const preventClose = onOptionClick?.(opt);
    if (!preventClose) {
      onChange(opt.value);
      setOpen(false);
    }
  };

  const list = (modalVersion = false) => (
    <div className="py-1 max-h-64 overflow-auto">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            className={`w-full text-left px-2.5 py-1.5 rounded hover:bg-muted text-[11px] flex items-center ${
              modalVersion ? "gap-2" : "justify-between"
            }`}
            onClick={() => handleSelect(opt)}
          >
            <span className={modalVersion ? "" : "whitespace-nowrap"}>
              {opt.label}
            </span>
            {active && <Check className="w-3 h-3 opacity-80" />}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={`relative ${minWidthClass}`}>
      <button
        type="button"
        className={`${fieldBase} flex items-center justify-between ${className}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate">
          {renderLabel ? renderLabel(selected) : selected?.label || placeholder}
        </span>
        <ChevronDown className="w-3 h-3 opacity-70" />
      </button>

      {/* Desktop: popover com largura flexível conforme texto */}
      {open && !isMobile && (
        <div
          ref={panelRef}
          className={`absolute ${positionClass} z-50 inline-block rounded-lg border border-border-dark bg-card shadow-lg p-1.5`}
        >
          {list(false)}
        </div>
      )}

      {/* Mobile: modal */}
      {open && isMobile && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={selected?.label || placeholder || "Selecionar"}
        >
          <div className="pt-2">{list(true)}</div>
        </Modal>
      )}
    </div>
  );
}
