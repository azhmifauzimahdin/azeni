import { Theme } from "@/types";
import { create } from "zustand";

interface ThemeState {
  themes: Theme[];
  setThemes: (themes: Theme[]) => void;
  upsertThemeAtFirst: (newTheme: Theme) => void;
  deleteThemeById: (id: string) => void;
}

const useAdminThemeStore = create<ThemeState>((set) => ({
  themes: [],
  setThemes: (themes) => set({ themes }),
  upsertThemeAtFirst: (newTheme) =>
    set((state) => {
      const existingIndex = state.themes.findIndex((b) => b.id === newTheme.id);

      if (existingIndex !== -1) {
        const updatedThemes = [...state.themes];
        updatedThemes[existingIndex] = newTheme;
        return { themes: updatedThemes };
      }

      return { themes: [newTheme, ...state.themes] };
    }),
  deleteThemeById: (id) =>
    set((state) => ({
      themes: state.themes.filter((b) => b.id !== id),
    })),
}));

export default useAdminThemeStore;
