import { Invitation } from "@/types";
import { create } from "zustand";

interface InvitationState {
  invitations: Invitation[];
  setInvitations: (invitation: Invitation[]) => void;
  addInvitationAtFirst: (newInvitation: Invitation) => void;
  updateQuoteInInvitation: (
    invitationId: string,
    updatedQuote: Partial<Invitation["quote"]>
  ) => void;
  updateMusicInInvitation: (
    invitationId: string,
    updatedMusic: Partial<Invitation["music"]>
  ) => void;
  deleteQuoteInInvitation: (invitationId: string) => void;
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
}));

export default useInvitationStore;
