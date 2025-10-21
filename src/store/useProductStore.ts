import axios from "axios";
import { create } from "zustand";
import { Product, FakeProduct, ProductState } from "@/lib/types";
import { sortData, toggleSelection, toggleSelectAll } from "@/lib/utils";

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  sortedProducts: [],
  selected: [],
  sortConfig: { key: null, direction: "asc" },

  fetchProducts: async () => {
    const res = await axios.get<FakeProduct[]>(
      "https://fakestoreapi.com/products"
    );
    const data = res.data;

    const mapped: Product[] = data.map((item) => ({
      id: String(item.id),
      name: item.title,
      price: item.price,
      margin: Math.random() * 40 - 5,
      totalProfit: Math.random() * 300 - 100,
      workingCapital: Math.random() * 1000 - 500,
      sales: Math.floor(Math.random() * 100),
      status: "Precificado",
      origin: item.category,
      image: item.image,
      stockLevel: Math.floor(Math.random() * 50),
      salesHistory: Array.from({ length: 7 }, () =>
        Math.floor(Math.random() * 20)
      ),
      profitHistory: Array.from({ length: 7 }, () =>
        Math.floor(Math.random() * 100 - 50)
      ),
    }));

    set({ products: mapped, sortedProducts: mapped, selected: [] });
  },

  toggleOne: (id) => {
    set((state) => ({ selected: toggleSelection(state.selected, id) }));
  },

  toggleAll: () => {
    const state = get();
    set({ selected: toggleSelectAll(state.products, state.selected) });
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
