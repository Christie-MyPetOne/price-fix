import { create } from "zustand";

type Mode = "reais" | "percentual";

interface DisplayModeState {
  mode: Mode;
  setMode: (m: Mode) => void;
}

export const useDisplayModeStore = create<DisplayModeState>((set) => ({
  mode: "reais",
  setMode: (m) => set({ mode: m }),
}));
