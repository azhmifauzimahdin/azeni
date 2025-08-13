import { BalanceReferralCode } from "@/types";
import { create } from "zustand";

interface BalanceReferralCodeState {
  balanceReferralCode: BalanceReferralCode | undefined;
  setBalanceReferralCode: (data: BalanceReferralCode) => void;
  updateBalanceReferralCode: (data: Partial<BalanceReferralCode>) => void;
  clearBalanceReferralCode: () => void;
}

export const useBalanceReferralCodeStore = create<BalanceReferralCodeState>(
  (set) => ({
    balanceReferralCode: undefined,
    setBalanceReferralCode: (balanceReferralCode) =>
      set({ balanceReferralCode }),
    updateBalanceReferralCode: (data) =>
      set((state) =>
        state.balanceReferralCode
          ? { balanceReferralCode: { ...state.balanceReferralCode, ...data } }
          : state
      ),
    clearBalanceReferralCode: () => set({ balanceReferralCode: undefined }),
  })
);
