// src/components/dashboard/MultiSelects.tsx
"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useOutsideClose } from "@/hooks/useOutsideClose";
import { fieldBase } from "./SingleSelect";

type MultiProps = {
  value: string[];
  onChange: (next: string[]) => void;
  isMobile?: boolean;
};

function createMultiSelect(
  labelDesktop: string,
  modalTitle: string,
  optionsFactory: () => { id: string; label: string }[]
) {
  return function MultiSelect({ value, onChange, isMobile = false }: MultiProps) {
    const [open, setOpen] = useState(false);
    const panelRef = useOutsideClose<HTMLDivElement>(
      open && !isMobile,
      () => setOpen(false)
    );

    const options = useMemo(optionsFactory, []);
    const allSelected = value.length === options.length;
    const someSelected = value.length > 0 && !allSelected;

    const buttonText = useMemo(() => {
      if (value.length === 0) return isMobile ? modalTitle : labelDesktop;
      if (value.length === 1)
        return options.find((o) => o.id === value[0])?.label;
      return `${value.length} selecionados`;
    }, [value, options, isMobile]);

    function toggle(id: string) {
      onChange(
        value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
      );
    }

    function toggleAll() {
      onChange(allSelected ? [] : options.map((o) => o.id));
    }

    const listContent = (
      <>
        <button
          type="button"
          className="w-full text-left px-2.5 py-1.5 rounded hover:bg-muted text-[11px] flex items-center gap-2"
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

        <div className="py-1 max-h-64 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-muted text-[11px] flex items-center gap-2"
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
      </>
    );

    return (
      <div className="relative min-w-0">
        <button
          type="button"
          className={`${fieldBase} min-w-0 md:min-w-[120px] flex items-center justify-between`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="truncate">{buttonText}</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </button>

        {/* Desktop: popover flexível */}
        {open && !isMobile && (
          <div
            ref={panelRef}
            className="absolute left-0 top-[calc(100%+8px)] z-50 inline-block rounded-lg border border-border-dark bg-card shadow-lg px-2 py-1.5"
          >
            {listContent}
            <div className="flex justify-end pt-1">
              <button
                className="h-7 px-3 rounded-md bg-primary text-white text-[11px]"
                onClick={() => setOpen(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Mobile: modal */}
        {open && isMobile && (
          <Modal open={open} onClose={() => setOpen(false)} title={modalTitle}>
            <div className="pt-2 space-y-2">
              {listContent}
              <div className="flex justify-end pt-2">
                <button
                  className="h-8 px-4 rounded-md bg-primary text-white text-[12px]"
                  onClick={() => setOpen(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  };
}

export const EmpresasMultiSelect = createMultiSelect(
  "Selecione empresas",
  "Empresas",
  () => [
    { id: "conta1", label: "Conta 1" },
    { id: "conta2", label: "Conta 2" },
    { id: "conta3", label: "Conta 3" },
  ]
);

export const MarketplacesMultiSelect = createMultiSelect(
  "Selecione marketplaces",
  "Marketplaces",
  () => [
    { id: "shopee", label: "Shopee" },
    { id: "mercado_livre", label: "Mercado Livre" },
    { id: "amazon", label: "Amazon" },
  ]
);
