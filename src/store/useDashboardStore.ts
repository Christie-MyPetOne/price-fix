import { create } from "zustand";

export const useDashboardStore = create((set) => ({
  dashboardData: null,
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(
        "https://dummyjson.com/c/be22-3b12-4717-878d"
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }

      const data = await response.json();

      set({ dashboardData: data, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
