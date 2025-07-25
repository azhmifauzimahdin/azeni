import { Bank } from "@/types";
import { create } from "zustand";

interface BankState {
  banks: Bank[];
  setBanks: (banks: Bank[]) => void;
  upsertBankAtFirst: (newBank: Bank) => void;
  deleteBankById: (id: string) => void;
}

const useAdminBankStore = create<BankState>((set) => ({
  banks: [],
  setBanks: (banks) => set({ banks }),
  upsertBankAtFirst: (newBank) =>
    set((state) => {
      const existingIndex = state.banks.findIndex((b) => b.id === newBank.id);

      if (existingIndex !== -1) {
        const updatedBanks = [...state.banks];
        updatedBanks[existingIndex] = newBank;
        return { banks: updatedBanks };
      }

      return { banks: [newBank, ...state.banks] };
    }),
  deleteBankById: (id) =>
    set((state) => ({
      banks: state.banks.filter((b) => b.id !== id),
    })),
}));

export default useAdminBankStore;
