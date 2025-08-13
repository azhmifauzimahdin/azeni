import { ReferralCode, ReferralWithdrawal } from "@/types";
import { create } from "zustand";

interface ReferralCodeState {
  referralCode: ReferralCode | undefined;
  setReferralCode: (data: ReferralCode) => void;
  updateReferralCode: (data: Partial<ReferralCode>) => void;
  clearReferralCode: () => void;
  addWithdrawal: (withdrawal: ReferralWithdrawal) => void;
}

export const useReferralCodeStore = create<ReferralCodeState>((set) => ({
  referralCode: undefined,
  setReferralCode: (referralCode) => set({ referralCode }),
  updateReferralCode: (data) =>
    set((state) =>
      state.referralCode
        ? { referralCode: { ...state.referralCode, ...data } }
        : state
    ),
  clearReferralCode: () => set({ referralCode: undefined }),
  addWithdrawal: (withdrawal) =>
    set((state) => {
      if (!state.referralCode) return state;

      return {
        referralCode: {
          ...state.referralCode,
          withdrawals: [withdrawal, ...(state.referralCode.withdrawals || [])],
        },
      };
    }),
}));
