"use client";

import React, { useState, useRef, useEffect } from "react";

export type UiSelectProps = {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
  placeholder?: string;
};

export default function UiSelect({
  value,
  onChange,
  options,
  className = "",
  placeholder = "Selecionar",
}: UiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div ref={ref} className={`relative inline-block w-full ${className}`}>
      <button
        type="button"
        className="
          appearance-none h-10 px-3 pr-8 rounded-md
          border border-border-dark bg-transparent text-sm text-text
          text-left focus:outline-none focus:ring-2 focus:ring-primary/30
        "
        onClick={() => setOpen((s) => !s)}
      >
        {value || placeholder}
      </button>

      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary"
        aria-hidden="true"
      >
        <path
          d="M7 10l5 5 5-5"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {open && (
        <div
          className="
            absolute top-full left-0 mt-2 w-[clamp(160px,40vw,355px)] bg-card rounded-md
            shadow-lg py-1 z-20 border border-border-dark
            max-h-56 overflow-y-auto
          "
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-text-secondary">
              Sem opções
            </div>
          ) : (
            options.map((opt) => (
              <button
                key={opt}
                type="button"
                className="
                  w-full text-left px-3 py-2 text-sm
                  hover:bg-primary/10
                "
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
