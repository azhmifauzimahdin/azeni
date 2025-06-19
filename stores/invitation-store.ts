import { Invitation } from "@/types";
import { create } from "zustand";

interface InvitationState {
  invitations: Invitation[];
  setInvitations: (invitation: Invitation[]) => void;
  addInvitationAtFirst: (newInvitation: Invitation) => void;
  getInvitationById: (id: string) => Invitation | undefined;
}

const useInvitationStore = create<InvitationState>((set, get) => ({
  invitations: [],
  setInvitations: (invitations) => set({ invitations }),
  addInvitationAtFirst: (newInvitation) =>
    set((state) => ({
      invitations: [newInvitation, ...state.invitations],
    })),
  getInvitationById: (id) => {
    const { invitations } = get();
    return invitations.find((inv) => inv.id === id);
  },
}));

export default useInvitationStore;
