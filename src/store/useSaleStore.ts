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
  /**
   * Aplica um filtro simples nos dados já carregados em memória.
   * Este é um filtro client-side básico para dar suporte à UI enquanto
   * não houver uma API de busca mais avançada.
   */
  filterSales: (opts: { q?: string; date?: string; empresa?: string; canal?: string; produto?: string }) => {
    const all = get().sales || [];
    const q = opts.q?.trim().toLowerCase();

    if (!q && !opts.date && !opts.empresa && !opts.canal && !opts.produto) {
      // nada para filtrar
      return;
    }

    const filtered = all.filter((s) => {
      let match = true;
      if (q) {
        const inClient = s.client?.nome?.toLowerCase().includes(q);
        const inItems = s.items?.some((it) => (it.name || "").toLowerCase().includes(q));
        match = match && (inClient || inItems);
      }
      // filtros simples por outras propriedades (se fornecidas) — compare strings
      if (opts.empresa) match = match && String(s.client?.nome || "").toLowerCase().includes(opts.empresa.toLowerCase());
  if (opts.produto) match = match && s.items?.some((it) => (it.name || "").toLowerCase().includes(opts.produto!.toLowerCase()));
      // date/canal podem ser added conforme necessidade; por ora não filtramos por eles especificamente
      return match;
    });

    set({ sales: filtered });
  },

  /**
   * Restaura a lista completa de vendas (recarrega do servidor).
   */
  clearFilters: async () => {
    // reaproveita fetchSales
    const fn = get().fetchSales;
    if (fn) await fn();
  },
}));
