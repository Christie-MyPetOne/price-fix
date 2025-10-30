"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface PurchaseConfigModalProps {
  open: boolean;
  onClose: () => void;
}

export const PurchaseConfigModal = ({
  open,
  onClose,
}: PurchaseConfigModalProps) => {
  const [config, setConfig] = useState({
    comprarPara: 40,
    entregaEstimada: 5,
    excelente: 30,
    moderado: 40,
    risco: 50,
    parado: 60,
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card text-text rounded-lg shadow-xl w-full max-w-lg flex flex-col relative border border-border-dark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b border-border-dark">
          <h2 className="text-lg font-semibold">Saúde do Estoque</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-background"
          >
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <p className="text-sm text-text-secondary">
            As definições padrão de estoque serão utilizadas para todos os
            produtos que não tiverem uma configuração personalizada.
          </p>

          {/* Campos principais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary">
                Comprar para (dias)
              </label>
              <input
                type="number"
                value={config.comprarPara}
                onChange={(e) =>
                  setConfig({ ...config, comprarPara: +e.target.value })
                }
                className="w-full bg-background border border-border-dark rounded-md px-3 py-2 text-sm text-text focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">
                Entrega estimada (dias)
              </label>
              <input
                type="number"
                value={config.entregaEstimada}
                onChange={(e) =>
                  setConfig({ ...config, entregaEstimada: +e.target.value })
                }
                className="w-full bg-background border border-border-dark rounded-md px-3 py-2 text-sm text-text focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Saúde de estoque */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-2">
              Saúde de estoque
            </h3>
            <p className="text-sm text-text-secondary mb-5">
              Avaliação do produto em estoque com base no tempo médio de
              renovação. Exemplo: para ser classificado como bom, o estoque deve
              ter um giro máximo de 30 dias.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Excelente", key: "excelente", color: "bg-green-500" },
                { label: "Moderado", key: "moderado", color: "bg-yellow-400" },
                { label: "Risco", key: "risco", color: "bg-red-500" },
                { label: "Parado", key: "parado", color: "bg-blue-400" },
              ].map(({ label, key, color }) => (
                <div
                  key={key}
                  className="flex flex-col items-start bg-background border border-border-dark rounded-md p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-xs font-medium text-text">
                      {label}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={config[key as keyof typeof config]}
                    onChange={(e) =>
                      setConfig({ ...config, [key]: +e.target.value })
                    }
                    className="w-full bg-card border border-border-dark rounded-md px-2 py-1.5 text-xs text-text focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex justify-end items-center p-4 border-t border-border-dark gap-3">
          <button
            onClick={() =>
              setConfig({
                comprarPara: 40,
                entregaEstimada: 5,
                excelente: 30,
                moderado: 40,
                risco: 50,
                parado: 60,
              })
            }
            className="px-4 py-2 rounded-md border border-border-dark hover:bg-background text-sm text-text transition-colors"
          >
            Reverter padrão
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark transition-colors text-white font-semibold text-sm"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
