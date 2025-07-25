import { Transaction } from "@/types";
import { create } from "zustand";

interface TransactionState {
  transactions: Transaction[];
  setTransactions: (transaction: Transaction[]) => void;
  upsertTransactionAtFirst: (newTransaction: Transaction) => void;
  deleteTransactionById: (id: string) => void;
}

const useAdminTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  upsertTransactionAtFirst: (newTransaction) =>
    set((state) => {
      const existingIndex = state.transactions.findIndex(
        (b) => b.id === newTransaction.id
      );

      if (existingIndex !== -1) {
        const updatedTransactions = [...state.transactions];
        updatedTransactions[existingIndex] = newTransaction;
        return { transactions: updatedTransactions };
      }

      return { transactions: [newTransaction, ...state.transactions] };
    }),
  deleteTransactionById: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((b) => b.id !== id),
    })),
}));

export default useAdminTransactionStore;
