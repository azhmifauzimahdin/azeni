import { ThemeCategory } from "@/types";
import { create } from "zustand";

interface ThemeCategoryState {
  themeCategories: ThemeCategory[];
  setThemeCategories: (themeCategories: ThemeCategory[]) => void;
  upsertThemeCategoryAtFirst: (newThemeCategory: ThemeCategory) => void;
  deleteThemeCategoryById: (id: string) => void;
}

const useAdminThemeCategoryStore = create<ThemeCategoryState>((set) => ({
  themeCategories: [],
  setThemeCategories: (themeCategories) => set({ themeCategories }),
  upsertThemeCategoryAtFirst: (newThemeCategory) =>
    set((state) => {
      const existingIndex = state.themeCategories.findIndex(
        (b) => b.id === newThemeCategory.id
      );

      if (existingIndex !== -1) {
        const updatedThemeCategories = [...state.themeCategories];
        updatedThemeCategories[existingIndex] = newThemeCategory;
        return { themeCategories: updatedThemeCategories };
      }

      return { themeCategories: [newThemeCategory, ...state.themeCategories] };
    }),
  deleteThemeCategoryById: (id) =>
    set((state) => ({
      themeCategories: state.themeCategories.filter((b) => b.id !== id),
    })),
}));

export default useAdminThemeCategoryStore;
