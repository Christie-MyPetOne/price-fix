"use client";

import React from "react";
import { X } from "lucide-react";

interface ContextualActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  children: React.ReactNode;
}

export const ContextualActionBar: React.FC<ContextualActionBarProps> = ({
  selectedCount,
  onClearSelection,
  children,
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-auto bg-card border border-border-dark shadow-2xl rounded-lg z-30 animate-fade-in-up">
      <div className="flex items-center gap-6 px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onClearSelection}
            className="p-2 rounded-full bg-card hover:bg-[var(--color-primary)] transition-colors"
            title="Limpar seleção"
          >
            <X size={18} className="text-text" />
          </button>
          <p className="text-sm font-semibold text-text">
            <span className="text-primary">{selectedCount}</span> selecionado(s)
          </p>
        </div>
        <div className="h-6 w-px bg-border-dark"></div>
        <div className="flex items-center gap-4">{children}</div>
      </div>
    </div>
  );
};
