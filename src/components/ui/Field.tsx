// src/components/ui/Field.tsx
import React from "react";

type FieldProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  help?: string;
  error?: string;
};

export const Field: React.FC<FieldProps> = ({ label, children, help, error }) => (
  <div className="p-0">
    <div className="flex items-start gap-2 justify-between">
      {/* Assumindo que o label é um ReactNode para permitir a passagem do botão Testar Conexão */}
      <label className="block text-sm font-medium text-[var(--color-text)]">{label}</label>
    </div>
    <div className="mt-2">{children}</div>
    {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    {help && <p className="text-xs text-[var(--color-text-secondary)] mt-2">{help}</p>}
  </div>
);