import { Bank } from "@/types";
import { create } from "zustand";

interface BankState {
  banks: Bank[];
  setBanks: (banks: Bank[]) => void;
  addBankAtFirst: (newBank: Bank) => void;
}

const useBankStore = create<BankState>((set) => ({
  banks: [],
  setBanks: (banks) => set({ banks }),
  addBankAtFirst: (newBank) =>
    set((state) => ({
      banks: [newBank, ...state.banks],
    })),
}));

export default useBankStore;
