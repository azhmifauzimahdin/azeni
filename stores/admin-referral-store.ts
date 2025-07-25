import { ReferralCode } from "@/types";
import { create } from "zustand";

interface BankState {
  referralCodes: ReferralCode[];
  setReferralCodes: (referralCodes: ReferralCode[]) => void;
  upsertReferralCodeAtFirst: (newReferralCode: ReferralCode) => void;
  deleteReferralCodeById: (id: string) => void;
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
}));

export default useAdminReferralCodeStore;
