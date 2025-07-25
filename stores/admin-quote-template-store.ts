import { QuoteTemplate } from "@/types";
import { create } from "zustand";

interface QuoteTemplateState {
  quoteTemplates: QuoteTemplate[];
  setQuoteTemplates: (quoteTemplates: QuoteTemplate[]) => void;
  upsertQuoteTemplateAtFirst: (newQuoteTemplate: QuoteTemplate) => void;
  deleteQuoteTemplateById: (id: string) => void;
}

const useAdminQuoteTemplateStore = create<QuoteTemplateState>((set) => ({
  quoteTemplates: [],
  setQuoteTemplates: (quoteTemplates) => set({ quoteTemplates }),
  upsertQuoteTemplateAtFirst: (newQuoteTemplate) =>
    set((state) => {
      const existingIndex = state.quoteTemplates.findIndex(
        (b) => b.id === newQuoteTemplate.id
      );

      if (existingIndex !== -1) {
        const updatedQuoteTemplates = [...state.quoteTemplates];
        updatedQuoteTemplates[existingIndex] = newQuoteTemplate;
        return { quoteTemplates: updatedQuoteTemplates };
      }

      return { quoteTemplates: [newQuoteTemplate, ...state.quoteTemplates] };
    }),
  deleteQuoteTemplateById: (id) =>
    set((state) => ({
      quoteTemplates: state.quoteTemplates.filter((b) => b.id !== id),
    })),
}));

export default useAdminQuoteTemplateStore;
