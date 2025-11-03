import { create } from "zustand";
import { StockConfig } from "@/lib/types";

interface StockConfigState {
  configPadrao: StockConfig;
  configsIndividuais: Record<string, StockConfig>;
  setConfigPadrao: (config: StockConfig) => void;
  setConfigProduto: (id: string, config: StockConfig) => void;
  getConfigProduto: (id: string) => StockConfig;
}

export const useStockConfigStore = create<StockConfigState>((set, get) => ({
  configPadrao: {
    comprarPara: 30,
    entregaEstimada: 7,
    excelente: 40,
    moderado: 60,
    risco: 80,
    parado: 81,
  },
  configsIndividuais: {},

  setConfigPadrao: (config) => set({ configPadrao: config }),

  setConfigProduto: (id, config) =>
    set((state) => ({
      configsIndividuais: { ...state.configsIndividuais, [id]: config },
    })),

  getConfigProduto: (id) => {
    const state = get();
    return state.configsIndividuais[id] || state.configPadrao;
  },
}));
