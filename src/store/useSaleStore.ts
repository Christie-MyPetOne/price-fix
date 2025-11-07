import axios from "axios";
import { create } from "zustand";
// Importa os tipos 'Sale' e 'SaleState' do seu arquivo de tipos
import { Sale, SaleState } from "@/lib/types";

// ✅ URL final com os 30 registros de vendas
const API_URL = "https://dummyjson.com/c/c383-9dfb-4897-b897";

export const useSaleStore = create<SaleState>((set, get) => ({
  sales: [],
  loading: false,

  /**
   * Busca os pedidos/vendas JÁ UNIFICADOS da sua API.
   */
  fetchSales: async () => {
    set({ loading: true });
    try {
      // A API retorna um objeto { sales: Sale[] }
      const res = await axios.get<{ sales: Sale[] }>(API_URL);

      // Salva o array de vendas no estado
      set({ sales: res.data.sales || [], loading: false });
    } catch (error) {
      console.error("Falha ao buscar vendas:", error);
      set({ sales: [], loading: false });
    }
  },

  /**
   * Um seletor simples para pegar uma venda específica pelo ID.
   */
  getSaleById: (id: string) => {
    const state = get();
    return state.sales.find((sale) => sale.id === id);
  },
}));
