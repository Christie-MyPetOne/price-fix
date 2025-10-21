"use client";
import { create } from "zustand";
import axios from "axios";

// Tipos
export interface Customer { customerId: string; firstName: string; lastName: string; email: string; }
export interface SaleItem { productId: string; productName: string; category: string; quantity: number; price: number; }
export interface Sale { id: string; customer: Customer; items: SaleItem[]; totalAmount: number; status: string; orderDate: string; }
export type SalesFilters = { q?: string; date?: string; empresa?: string; canal?: string; produto?: string; };

interface SalesState {
  allSales: Sale[];
  sales: Sale[];
  loading: boolean;
  fetchSales: (length?: number) => Promise<void>;
  filterSales: (filters: SalesFilters) => void;
  clearFilters: () => void;
}

// helper: "YYYY-MM-DD" no fuso local
function ymdLocal(dateLike: string | Date | undefined | null) {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export const useSalesStore = create<SalesState>((set, get) => ({
  allSales: [],
  sales: [],
  loading: false,

  fetchSales: async (length = 120) => {
    set({ loading: true });
    try {
      const res = await axios.get<Sale[]>(`https://fake.jsonmockapi.com/orders?length=${length}`);
      const data = res.data ?? [];
      set({ allSales: data, sales: data });
    } catch (e) {
      console.error("Erro ao buscar vendas:", e);
      set({ allSales: [], sales: [] });
    } finally {
      set({ loading: false });
    }
  },

  filterSales: (filters) => {
    const base = get().allSales;

    const filtered = base.filter((s) => {
      // busca livre (id, status, cliente, produtos)
      const haystack = `${s.id} ${s.status} ${s.customer?.firstName ?? ""} ${s.customer?.lastName ?? ""} ${(s.items ?? []).map(i => i.productName).join(" ")}`
        .toLowerCase();

      const okQ = filters.q ? haystack.includes(String(filters.q).toLowerCase()) : true;
      const okDate = filters.date ? ymdLocal(s.orderDate) === filters.date : true;
      const okEmpresa = filters.empresa ? (s as any).empresa === filters.empresa : true;
      const okCanal = filters.canal ? (s as any).canal === filters.canal : true;
      const okProduto = filters.produto ? (s.items ?? []).some(i => i.productName === filters.produto) : true;

      return okQ && okDate && okEmpresa && okCanal && okProduto;
    });

    set({ sales: filtered });
  },

  clearFilters: () => set((st) => ({ sales: st.allSales })),
}));
