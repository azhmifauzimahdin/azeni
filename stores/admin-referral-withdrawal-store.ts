import { ReferralWithdrawal } from "@/types";
import { create } from "zustand";

interface ReferralWithdrawalCodeState {
  withdrawals: ReferralWithdrawal[];
  setReferralWithdrawal: (data: ReferralWithdrawal[]) => void;
  upsertReferralWithdrawalAtFirst: (
    newReferralWithdrawal: ReferralWithdrawal
  ) => void;
  clearReferralWithdrawal: () => void;
}

export const useAdminReferralWithdrawalStore =
  create<ReferralWithdrawalCodeState>((set) => ({
    withdrawals: [],
    setReferralWithdrawal: (withdrawals) => set({ withdrawals }),
    upsertReferralWithdrawalAtFirst: (newWithdrawal) =>
      set((state) => {
        const existingIndex = state.withdrawals.findIndex(
          (b) => b.id === newWithdrawal.id
        );

        if (existingIndex !== -1) {
          const updatedReferralWithdrawal = [...state.withdrawals];
          updatedReferralWithdrawal[existingIndex] = newWithdrawal;
          return { withdrawals: updatedReferralWithdrawal };
        }

        return { withdrawals: [newWithdrawal, ...state.withdrawals] };
      }),
    clearReferralWithdrawal: () => set({ withdrawals: undefined }),
  }));
