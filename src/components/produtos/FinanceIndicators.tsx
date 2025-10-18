"use client";

import React from "react";

// A correção é garantir que a função não aceite nenhuma prop,
// já que este componente é apenas para exibição.
export function FinanceIndicators() {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border-dark h-full">
      <h2 className="text-xl font-bold mb-4 text-text">
        Indicadores Financeiros
      </h2>

      {/* Exemplo de conteúdo dos indicadores */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-text-secondary">
            Lucro Total
          </h3>
          <p className="text-2xl font-semibold text-primary">R$ 9.850,75</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-text-secondary">
            Margem Média
          </h3>
          <p className="text-2xl font-semibold text-text">18.5%</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-text-secondary">
            Capital de Giro
          </h3>
          <p className="text-2xl font-semibold text-error">-R$ 2.340,10</p>
        </div>
      </div>
    </div>
  );
}
