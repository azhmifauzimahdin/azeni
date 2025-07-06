import { QuoteTemplate } from "@/types";
import { create } from "zustand";

interface QuoteTemplateState {
  quoteTemplates: QuoteTemplate[];
  setQuoteTemplates: (quoteTemplates: QuoteTemplate[]) => void;
  addQuoteTemplateAtFirst: (newQuoteTemplate: QuoteTemplate) => void;
}

const useQuoteTemplateStore = create<QuoteTemplateState>((set) => ({
  quoteTemplates: [],
  setQuoteTemplates: (quoteTemplates) => set({ quoteTemplates }),
  addQuoteTemplateAtFirst: (newQuoteTemplate) =>
    set((state) => ({
      quoteTemplates: [newQuoteTemplate, ...state.quoteTemplates],
    })),
}));

export default useQuoteTemplateStore;
