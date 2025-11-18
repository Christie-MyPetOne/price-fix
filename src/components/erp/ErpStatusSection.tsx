// src/components/erp/ErpStatusSection.tsx
import React from 'react';
import { CheckCircle2, RefreshCcw } from 'lucide-react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button"; // Reutilizando seu componente Button

type ErpStatusSectionProps = {
  lastUpdated: string;
  loadingSync: "all" | "prod" | "vendas" | null;
  simulateSync: (type: "all" | "prod" | "vendas") => Promise<void>;
  canSync: boolean;
};

// Componente ActionBtn incorporado no JSX (usando Button + lógica de loading/disabled)
const SyncActionButton: React.FC<{
  label: string;
  type: "all" | "prod" | "vendas";
  loading: "all" | "prod" | "vendas" | null;
  onClick: (type: "all" | "prod" | "vendas") => Promise<void>;
  disabled: boolean;
}> = ({ label, type, loading, onClick, disabled }) => {
  const isLoading = loading === type;
  
  // O estilo foi adaptado para a classe 'Button' ou mantido em Tailwind para simular o ActionBtn
  const baseClasses = "inline-flex items-center gap-2 px-3 py-2 rounded-md border text-xs sm:text-sm font-medium ";
  const dynamicClasses = disabled
    ? "opacity-60 cursor-not-allowed border-[var(--color-border-dark)]"
    : "bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border-dark)] hover:bg-[var(--color-primary-light)]/10";

  return (
    <Button
      onClick={() => onClick(type)}
      disabled={disabled || isLoading}
      className={baseClasses + dynamicClasses}
    >
      {isLoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
      {label}
    </Button>
  );
};


export const ErpStatusSection: React.FC<ErpStatusSectionProps> = ({
  lastUpdated, loadingSync, simulateSync, canSync
}) => (
  <Card className="p-0 bg-[var(--color-card)]">
    <div className="px-3 py-2 border-b border-[var(--color-border-dark)] flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      <span className="text-sm font-medium text-[var(--color-text)]">
        Status da última importação
      </span>
    </div>

    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2 text-sm text-emerald-700">
        <CheckCircle2 className="w-4 h-4" /> Seus pedidos foram atualizados{" "}
        <span className="font-medium">({lastUpdated})</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-[var(--color-text-secondary)]">Importação Manual:</span>

        <SyncActionButton
          label="SINCRONIZAR PRODUTOS E VENDAS"
          type="all"
          loading={loadingSync}
          onClick={simulateSync}
          disabled={!canSync}
        />

        <SyncActionButton
          label="SINCRONIZAR PRODUTOS"
          type="prod"
          loading={loadingSync}
          onClick={simulateSync}
          disabled={!canSync}
        />

        <SyncActionButton
          label="SINCRONIZAR VENDAS"
          type="vendas"
          loading={loadingSync}
          onClick={simulateSync}
          disabled={!canSync}
        />
      </div>
    </div>
  </Card>
);