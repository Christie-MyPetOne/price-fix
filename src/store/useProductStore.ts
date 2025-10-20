import { create } from "zustand";
import axios from "axios";
import { Product } from "../lib/types";
import { sortData, toggleSelection, toggleSelectAll } from "../lib/utils";

// Tipo da API FakeStore
interface FakeProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
}

interface ProductState {
  products: Product[];
  sortedProducts: Product[];
  selected: string[];
  sortConfig: { key: keyof Product | null; direction: "asc" | "desc" };
  fetchProducts: () => Promise<void>;
  toggleOne: (id: string) => void;
  toggleAll: () => void;
  sortBy: (key: keyof Product) => void;
}

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
      margin: Math.random() * 20,
      totalProfit: Math.random() * 200,
      workingCapital: Math.random() * 1000,
      sales: Math.floor(Math.random() * 100),
      status: "Precificado",
      origin: item.category,
      image: item.image,
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
