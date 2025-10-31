import axios from "axios";
import { create } from "zustand";
import { Product, ProductState } from "@/lib/types";
import { sortData, toggleSelection, toggleSelectAll } from "@/lib/utils";

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  sortedProducts: [],
  selected: [],
  sortConfig: { key: null, direction: "asc" },

  fetchProducts: async () => {
    try {
      // ✅ Corrigido: agora usando o endpoint JSON da sua coleção
      const res = await axios.get<{ products: Product[] }>(
        "https://dummyjson.com/c/2506-2c78-4ee8-8bcb"
      );

      const data = res.data.products;

      set({ products: data, sortedProducts: data, selected: [] });
    } catch (error: any) {
      console.error(
        "❌ Falha ao buscar produtos:",
        error.response?.data || error
      );
    }
  },

  toggleOne: (id: string) => {
    set((state) => ({ selected: toggleSelection(state.selected, id) }));
  },

  toggleAll: () => {
    const state = get();
    set({ selected: toggleSelectAll(state.sortedProducts, state.selected) });
  },

  sortBy: (key) => {
    const state = get();
    const direction =
      state.sortConfig.key === key && state.sortConfig.direction === "asc"
        ? "desc"
        : "asc";

    set({
      sortedProducts: sortData<Product>(state.sortedProducts, key, direction),
      sortConfig: { key, direction },
    });
  },
}));
