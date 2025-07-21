import { Transaction, WebhookLog } from "@/types";
import { create } from "zustand";

interface TransactionState {
  transactions: Transaction[];
  setTransactions: (transaction: Transaction[]) => void;
  addTransactionAtFirst: (newTransaction: Transaction) => void;
  updateTransactionStatusName: (
    transactionId: string,
    statusName: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED"
  ) => void;
  addWebhookLogToTransaction: (
    transactionId: string,
    newLog: WebhookLog
  ) => void;
}

const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  addTransactionAtFirst: (newTransaction) =>
    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
    })),
  updateTransactionStatusName: (transactionId, statusName) =>
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              status: {
                ...transaction.status,
                name: statusName,
              },
            }
          : transaction
      ),
    })),
  addWebhookLogToTransaction: (transactionId, newLog) =>
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              webhookLogs: [newLog, ...(transaction.webhookLogs || [])],
            }
          : transaction
      ),
    })),
}));

export default useTransactionStore;
