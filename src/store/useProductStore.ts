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

    const mapped: Product[] = data.map((item, index) => {
      const cost = parseFloat((item.price * 0.5).toFixed(2)); // custo = 50% do preço
      const shipping = 15;
      const marketplaceFee = 0.16; // 16%
      const feeValue = item.price * marketplaceFee;
      const totalCosts = cost + shipping + feeValue;
      const profit = item.price - totalCosts;
      const margin = item.price > 0 ? (profit / item.price) * 100 : 0;

      const stockLevel = index % 3 === 0 ? 60 : Math.floor(Math.random() * 50);
      const salesHistory =
        index % 3 === 0
          ? Array(7).fill(0)
          : Array.from({ length: 7 }, () => Math.floor(Math.random() * 20));

      return {
        id: String(item.id),
        name: item.title,
        price: item.price,
        cost,
        margin,
        totalProfit: Math.random() * 300 - 100,
        workingCapital: Math.random() * 1000 - 500,
        sales: salesHistory.reduce((a, b) => a + b, 0),
        status: "Precificado",
        origin: item.category,
        image: item.image,
        stockLevel,
        salesHistory,
        profitHistory: Array.from({ length: 7 }, () =>
          Math.floor(Math.random() * 100 - 50)
        ),
      };
    });

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
