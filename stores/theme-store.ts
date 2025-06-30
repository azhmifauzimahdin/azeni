import { Theme } from "@/types";
import { create } from "zustand";

interface ThemeState {
  themes: Theme[];
  setThemes: (themes: Theme[]) => void;
  addThemeAtFirst: (newTheme: Theme) => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  themes: [],
  setThemes: (themes) => set({ themes }),
  addThemeAtFirst: (newTheme) =>
    set((state) => ({
      themes: [newTheme, ...state.themes],
    })),
}));

export default useThemeStore;
