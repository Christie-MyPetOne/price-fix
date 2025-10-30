"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Product } from "@/lib/types";

interface PurchaseConfigModalProps {
  open: boolean;
  onClose: () => void;
  products?: Product[];
}

export const PurchaseConfigModal = ({
  open,
  onClose,
  products = [],
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

  const healthLevels = [
    { label: "Excelente", key: "excelente", color: "bg-green-500" },
    { label: "Moderado", key: "moderado", color: "bg-yellow-400" },
    { label: "Risco", key: "risco", color: "bg-red-500" },
    { label: "Parado", key: "parado", color: "bg-blue-400" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card text-text rounded-lg shadow-xl w-full max-w-lg flex flex-col relative border border-border-dark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Cabeçalho (Sem alteração) --- */}
        <div className="flex justify-between items-center p-4 border-b border-border-dark">
          <h2 className="text-lg font-semibold">
            {products.length > 0
              ? `Configurar Saúde de Estoque (${products.length})`
              : "Saúde de Estoque Padrão"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-background"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {products.length === 0 ? (
            <p className="text-sm text-text-secondary">
              As definições padrão de estoque serão utilizadas para todos os
              produtos que não tiverem uma configuração personalizada.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-text-secondary">
                Você está configurando {products.length} produto
                {products.length > 1 && "s"} selecionado
                {products.length > 1 && "s"}.
              </p>
              <ul className="text-xs text-text-secondary border border-border-dark rounded-md p-3 bg-background max-h-[100px] overflow-y-auto space-y-1">
                {products.map((p) => (
                  <li key={p.id} className="truncate">
                    <span className="font-medium">{p.name}</span> — Estoque:{" "}
                    {p.stockLevel ?? "-"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-text">
              Parâmetros de Compra
            </h3>

            <div className="flex justify-between items-center gap-4">
              <div>
                <label
                  htmlFor="comprarPara"
                  className="text-sm font-medium text-text"
                >
                  Comprar para (dias)
                </label>
                <p className="text-xs text-text-secondary">
                  Sugestão de compra para cobrir X dias.
                </p>
              </div>
              <input
                id="comprarPara"
                type="number"
                value={config.comprarPara}
                onChange={(e) =>
                  setConfig({ ...config, comprarPara: +e.target.value })
                }
                className="w-28 bg-background border border-border-dark rounded-md px-3 py-2 text-sm text-text text-right focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center gap-4">
              <div>
                <label
                  htmlFor="entregaEstimada"
                  className="text-sm font-medium text-text"
                >
                  Entrega estimada (dias)
                </label>
                <p className="text-xs text-text-secondary">
                  Tempo que o fornecedor leva para entregar.
                </p>
              </div>
              <input
                id="entregaEstimada"
                type="number"
                value={config.entregaEstimada}
                onChange={(e) =>
                  setConfig({ ...config, entregaEstimada: +e.target.value })
                }
                className="w-28 bg-background border border-border-dark rounded-md px-3 py-2 text-sm text-text text-right focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border-dark">
            <h3 className="text-base font-semibold text-text mb-1">
              Níveis de Saúde de Estoque
            </h3>
            <p className="text-sm text-text-secondary">
              Defina os limites (em dias) para cada categoria de saúde.
            </p>

            <div className="space-y-3">
              {healthLevels.map(({ label, key, color }) => (
                <div
                  key={key}
                  className="flex justify-between items-center gap-4 p-3 bg-background border border-border-dark rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <label
                      htmlFor={key}
                      className="text-sm font-medium text-text"
                    >
                      {label}
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-secondary">Até</span>
                    <input
                      id={key}
                      type="number"
                      value={config[key as keyof typeof config]}
                      onChange={(e) =>
                        setConfig({ ...config, [key]: +e.target.value })
                      }
                      className="w-20 bg-card border border-border-dark rounded-md px-2 py-1.5 text-sm text-text text-right focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <span className="text-sm text-text-secondary w-8">
                      dias
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
            className="px-4 py-2 rounded-md bg-background hover:bg-border-dark text-sm text-text-secondary transition-colors"
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
