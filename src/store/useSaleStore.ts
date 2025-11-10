import axios from "axios";
import { create } from "zustand";
import { Sale, SaleState } from "@/lib/types";

const API_URL = "https://dummyjson.com/c/22ef-7a19-452a-9847";

export const useSaleStore = create<SaleState>((set, get) => ({
  sales: [],
  loading: false,

  fetchSales: async () => {
    set({ loading: true });
    try {
      const res = await axios.get<{ sales: Sale[] }>(API_URL);

      set({ sales: res.data.sales || [], loading: false });
    } catch (error) {
      console.error("Falha ao buscar vendas:", error);
      set({ sales: [], loading: false });
    }
  },

  getSaleById: (id: string) => {
    const state = get();
    return state.sales.find((sale) => sale.id === id);
  },

  filterSales: (opts: {
    q?: string;
    date?: string;
    empresa?: string;
    canal?: string;
    produto?: string;
  }) => {
    const all = get().sales || [];
    const q = opts.q?.trim().toLowerCase();

    if (!q && !opts.date && !opts.empresa && !opts.canal && !opts.produto) {
      return;
    }

    const filtered = all.filter((s) => {
      let match = true;
      if (q) {
        const inClient = s.client?.nome?.toLowerCase().includes(q);
        const inItems = s.items?.some((it) =>
          (it.name || "").toLowerCase().includes(q)
        );
        match = match && (inClient || inItems);
      }
      if (opts.empresa)
        match =
          match &&
          String(s.client?.nome || "")
            .toLowerCase()
            .includes(opts.empresa.toLowerCase());
      if (opts.produto)
        match =
          match &&
          s.items?.some((it) =>
            (it.name || "").toLowerCase().includes(opts.produto!.toLowerCase())
          );
      return match;
    });

    set({ sales: filtered });
  },

  clearFilters: async () => {
    const fn = get().fetchSales;
    if (fn) await fn();
  },
}));
