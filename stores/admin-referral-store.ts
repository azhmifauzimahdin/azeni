import { ReferralCode, ReferralWithdrawal } from "@/types";
import { create } from "zustand";

interface BankState {
  referralCodes: ReferralCode[];
  setReferralCodes: (referralCodes: ReferralCode[]) => void;
  upsertReferralCodeAtFirst: (newReferralCode: ReferralCode) => void;
  deleteReferralCodeById: (id: string) => void;
  upsertWithdrawalToReferralCode: (
    referralCodeId: string,
    newWithdrawal: ReferralWithdrawal
  ) => void;
}

const useAdminReferralCodeStore = create<BankState>((set) => ({
  referralCodes: [],
  setReferralCodes: (referralCodes) => set({ referralCodes }),
  upsertReferralCodeAtFirst: (newReferralCode) =>
    set((state) => {
      const existingIndex = state.referralCodes.findIndex(
        (b) => b.id === newReferralCode.id
      );

      if (existingIndex !== -1) {
        const updatedReferralCodes = [...state.referralCodes];
        updatedReferralCodes[existingIndex] = newReferralCode;
        return { referralCodes: updatedReferralCodes };
      }

      return { referralCodes: [newReferralCode, ...state.referralCodes] };
    }),
  deleteReferralCodeById: (id) =>
    set((state) => ({
      referralCodes: state.referralCodes.filter((b) => b.id !== id),
    })),
  upsertWithdrawalToReferralCode: (referralCodeId, newWithdrawal) =>
    set((state) => ({
      referralCodes: state.referralCodes.map((code) => {
        if (code.id !== referralCodeId) return code;

        const existingIndex = code.withdrawals.findIndex(
          (w) => w.id === newWithdrawal.id
        );

        let updatedWithdrawals;
        if (existingIndex !== -1) {
          updatedWithdrawals = [...code.withdrawals];
          updatedWithdrawals[existingIndex] = newWithdrawal;
        } else {
          updatedWithdrawals = [newWithdrawal, ...code.withdrawals];
        }

        return {
          ...code,
          withdrawals: updatedWithdrawals,
        };
      }),
    })),
}));

export default useAdminReferralCodeStore;
