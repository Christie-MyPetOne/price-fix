"use client";
import { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Snowflake,
} from "lucide-react";
import { StockConfigModalProps, StockConfig } from "@/lib/types";
import { useStockConfigStore } from "@/store/useStockConfigStore";

export const StockConfigModal = ({
  open,
  onClose,
  products = [],
  config,
}: StockConfigModalProps) => {
  const [localConfig, setLocalConfig] = useState<StockConfig>(config);
  const { setConfigPadrao, setConfigProduto } = useStockConfigStore();

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  if (!open) return null;

  // ✅ Níveis com ícones e cores consistentes
  const healthLevels = [
    {
      label: "Excelente",
      key: "excelente",
      color: "text-green-500",
      icon: <CheckCircle2 size={16} className="text-green-500" />,
    },
    {
      label: "Moderado",
      key: "moderado",
      color: "text-yellow-500",
      icon: <AlertTriangle size={16} className="text-yellow-500" />,
    },
    {
      label: "Risco",
      key: "risco",
      color: "text-red-500",
      icon: <XCircle size={16} className="text-red-500" />,
    },
    {
      label: "Parado",
      key: "parado",
      color: "text-blue-400",
      icon: <Snowflake size={16} className="text-blue-400" />,
    },
  ];

  const handleSave = () => {
    if (products.length === 0) {
      setConfigPadrao(localConfig);
    } else {
      products.forEach((p) => setConfigProduto(p.id, localConfig));
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card text-text rounded-lg shadow-xl w-full max-w-lg flex flex-col relative border border-border-dark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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

        {/* Conteúdo */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Produtos selecionados */}
          {products.length === 0 ? (
            <p className="text-sm text-text-secondary">
              As definições padrão de estoque serão utilizadas para todos os
              produtos.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-text-secondary">
                Você está configurando {products.length} produto
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

          {/* --- Parâmetros de Compra --- */}
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
                value={localConfig.comprarPara}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    comprarPara: +e.target.value,
                  })
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
                value={localConfig.entregaEstimada}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    entregaEstimada: +e.target.value,
                  })
                }
                className="w-28 bg-background border border-border-dark rounded-md px-3 py-2 text-sm text-text text-right focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* --- Níveis de Saúde de Estoque --- */}
          <div className="space-y-4 pt-4 border-t border-border-dark">
            <h3 className="text-base font-semibold text-text mb-1">
              Níveis de Saúde de Estoque
            </h3>
            <p className="text-sm text-text-secondary">
              Defina os limites (em dias) para cada categoria.
            </p>

            <div className="space-y-3">
              {healthLevels.map(({ label, key, color, icon }) => (
                <div
                  key={key}
                  className="flex justify-between items-center gap-4 p-3 bg-background border border-border-dark rounded-md"
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <label
                      htmlFor={key}
                      className={`text-sm font-medium ${color}`}
                    >
                      {label}
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-secondary">Até</span>
                    <input
                      id={key}
                      type="number"
                      value={localConfig[key as keyof typeof localConfig]}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          [key]: +e.target.value,
                        })
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

        {/* --- Rodapé --- */}
        <div className="flex justify-end items-center p-4 border-t border-border-dark gap-3">
          <button
            onClick={() => setLocalConfig(config)}
            className="px-4 py-2 rounded-md bg-background hover:bg-border-dark text-sm text-text-secondary transition-colors"
          >
            Reverter
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:opacity-90 transition"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
