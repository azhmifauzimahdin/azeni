import { BankAccount, Invitation } from "@/types";
import { create } from "zustand";

interface InvitationState {
  invitations: Invitation[];
  setInvitations: (invitation: Invitation[]) => void;
  addInvitationAtFirst: (newInvitation: Invitation) => void;
  updateQuoteInInvitation: (
    invitationId: string,
    updatedQuote: Partial<Invitation["quote"]>
  ) => void;
  deleteQuoteInInvitation: (invitationId: string) => void;
  updateMusicInInvitation: (
    invitationId: string,
    updatedMusic: Partial<Invitation["music"]>
  ) => void;
  addOrUpdateBankAccountToInvitation: (
    invitationId: string,
    bankAccount: BankAccount
  ) => void;
  deleteBankAccountFromInvitation: (
    invitationId: string,
    bankAccountId: string
  ) => void;
}

const useInvitationStore = create<InvitationState>((set) => ({
  invitations: [],
  setInvitations: (invitations) => set({ invitations }),
  addInvitationAtFirst: (newInvitation) =>
    set((state) => ({
      invitations: [newInvitation, ...state.invitations],
    })),
  updateQuoteInInvitation: (invitationId, updatedQuote) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const existingQuote = invitation.quote ?? {
          id: "",
          name: "",
          author: "",
          invitationId: "",
          createdAt: "",
          updatedAt: "",
        };

        return {
          ...invitation,
          quote: {
            ...existingQuote,
            ...updatedQuote,
          },
        };
      }),
    })),
  updateMusicInInvitation: (invitationId, updatedMusic) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const existingMusic = invitation.music ?? {
          id: "",
          name: "",
          src: "",
          origin: "",
          visibility: false,
          createdAt: "",
          updatedAt: "",
        };

        return {
          ...invitation,
          music: {
            ...existingMusic,
            ...updatedMusic,
          },
        };
      }),
    })),
  deleteQuoteInInvitation: (invitationId) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) =>
        invitation.id === invitationId
          ? {
              ...invitation,
              quote: null,
            }
          : invitation
      ),
    })),
  addOrUpdateBankAccountToInvitation: (invitationId, bankAccount) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const existingBankAccounts = invitation.bankaccounts ?? [];

        const existingIndex = existingBankAccounts.findIndex(
          (acc) => acc.id === bankAccount.id
        );

        let updatedBankAccounts;
        if (existingIndex !== -1) {
          updatedBankAccounts = [...existingBankAccounts];
          updatedBankAccounts[existingIndex] = {
            ...existingBankAccounts[existingIndex],
            ...bankAccount,
          };
        } else {
          updatedBankAccounts = [...existingBankAccounts, bankAccount];
        }

        return {
          ...invitation,
          bankaccounts: updatedBankAccounts,
        };
      }),
    })),
  deleteBankAccountFromInvitation: (invitationId, bankAccountId) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const updatedBankAccounts =
          invitation.bankaccounts?.filter((acc) => acc.id !== bankAccountId) ??
          [];

        return {
          ...invitation,
          bankaccounts: updatedBankAccounts,
        };
      }),
    })),
}));

export default useInvitationStore;
