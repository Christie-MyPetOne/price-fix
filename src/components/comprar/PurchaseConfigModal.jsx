"use client";

import { useState } from "react";

export const PurchaseConfigModal = ({ open, onClose }) => {
  const [config, setConfig] = useState({
    comprarPara: 40,
    entregaEstimada: 5,
    bom: 30,
    media: 40,
    ruim: 50,
    congelado: 60,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-xl shadow-lg w-[95%] max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold border-border-dark">
          Saúde do Estoque
        </h2>
        <p className="text-sm text-gray-500">
          As definições padrão de estoque serão utilizadas para todos os
          produtos que não tiverem uma configuração personalizada ou específica.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm  border-border-dark font-medium">
                Comprar para (dias)
              </label>
              <input
                type="number"
                value={config.comprarPara}
                onChange={(e) =>
                  setConfig({ ...config, comprarPara: +e.target.value })
                }
                className="w-full border border-gray-300 rounded-md text-black px-2 py-1.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm  border-border-dark font-medium">
                Entrega estimada (dias)
              </label>
              <input
                type="number"
                value={config.entregaEstimada}
                onChange={(e) =>
                  setConfig({ ...config, entregaEstimada: +e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm text-black focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold border-border-dark mb-2">
              Saúde de estoque
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Avaliação do produto em estoque com base no tempo médio de
              renovação. Exemplo: para ser classificado como bom, o estoque deve
              ter um giro máximo de 30 dias.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Bom", key: "bom", color: "bg-green-500" },
                { label: "Média", key: "media", color: "bg-yellow-400" },
                { label: "Ruim", key: "ruim", color: "bg-red-500" },
                { label: "Congelado", key: "congelado", color: "bg-blue-400" },
              ].map(({ label, key, color }) => (
                <div
                  key={key}
                  className="flex flex-col items-start border border-gray-200 rounded-md p-2"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <div className={`w-3 h-3 rounded-full ${color}`}></div>
                    <span className="text-xs font-medium text-gray-700">
                      {label}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={config[key]}
                    onChange={(e) =>
                      setConfig({ ...config, [key]: +e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() =>
              setConfig({
                comprarPara: 40,
                entregaEstimada: 5,
                bom: 30,
                media: 40,
                ruim: 50,
                congelado: 60,
              })
            }
            className="px-4 py-2 text-sm border border-border-dark rounded-md hover:bg-primary-dark"
          >
            Reverter padrão
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
