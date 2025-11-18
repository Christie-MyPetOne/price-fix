// src/components/ui/MultiSelect.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

// --- TIPOS ---
// O tipo Option deve ser exportado ou definido globalmente
type Option = { label: string; value: string };
type MultiSelectProps = {
  label: React.ReactNode;
  placeholder: string;
  options: Option[];
  value: Option[];
  onChange: (v: Option[]) => void;
  emptyHint?: string;
  showSideToggle?: boolean;
};


// --- UTILS (Mantidos aqui por conveniência, mas podem ser separados) ---
export function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as any).randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

// --- HOOK (Mantido aqui por conveniência) ---
function useClickOutside<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T | null>(null);
  const memoizedOnClose = useCallback(onClose, [onClose]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) memoizedOnClose();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") memoizedOnClose();
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [memoizedOnClose]);
  return ref;
}

// --- Componente Tag (Auxiliar) ---
const Tag: React.FC<{ children: React.ReactNode; onClear: () => void }> = ({ children, onClear }) => (
  <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border-dark)]">
    {children}
    <button onClick={onClear} className="w-4 h-4 rounded hover:bg-black/10 flex items-center justify-center">
      ×
    </button>
  </span>
);

// --- MultiSelect Componente Principal ---
export const MultiSelect: React.FC<MultiSelectProps> = ({
  label, placeholder, options, value, onChange, emptyHint, showSideToggle = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const toggle = (opt: Option) => {
    const exists = value.some((o) => o.value === opt.value);
    onChange(exists ? value.filter((o) => o.value !== opt.value) : [...value, opt]);
  };

  const remove = (optValue: string) => onChange(value.filter((o) => o.value !== optValue));

  return (
    <div className="p-0">
      <label className="block text-sm font-medium text-[var(--color-text)]">{label}</label>

      <div className="flex flex-wrap gap-2 mt-2">
        {value.length === 0 && (
          <span className="text-xs text-[var(--color-text-secondary)]">{emptyHint ?? "Nenhum selecionado."}</span>
        )}
        {value.map((v) => <Tag key={v.value} onClear={() => remove(v.value)}>{v.label}</Tag>)}
      </div>

      <div className="relative mt-3" ref={ref}>
        <button
          onClick={() => setOpen((s) => !s)}
          className="w-full text-left rounded-md border border-solid border-[var(--color-border-dark)]
                     bg-[var(--color-card)] px-3 py-2 text-sm hover:bg-[var(--color-primary-light)]/5
                     transition inline-flex items-center justify-between shadow-sm"
        >
          {placeholder}
          <ChevronDown className="w-4 h-4 opacity-70" />
        </button>

        {open && (
          <div
            className="absolute z-50 mt-2 w-full rounded-lg border border-solid 
                       border-[var(--color-border-dark)] bg-[var(--color-card)]
                       shadow-lg max-h-56 overflow-auto p-1.5"
          >
            {options.map((opt) => {
              const active = value.some((v) => v.value === opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggle(opt)}
                  className="w-full text-left px-2.5 py-1.5 text-sm rounded 
                             hover:bg-[var(--color-primary-light)]/10 flex items-center gap-2
                             text-[var(--color-text)] transition"
                >
                  <span
                    className={`inline-flex w-4 h-4 items-center justify-center rounded border border-solid
                      ${
                        active
                          ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                          : "border-[var(--color-border-dark)] bg-[var(--color-card)]"
                      }`}
                  >
                    {active && <Check className="w-3 h-3" />}
                  </span>
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};