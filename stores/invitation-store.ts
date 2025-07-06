import { BankAccount, Gallery, Invitation, Schedule, Story } from "@/types";
import { create } from "zustand";

interface InvitationState {
  invitations: Invitation[];
  setInvitations: (invitation: Invitation[]) => void;
  addInvitationAtFirst: (newInvitation: Invitation) => void;
  updateCoupleInInvitation: (
    invitationId: string,
    updatedQuote: Partial<Invitation["quote"]>
  ) => void;
  updateCoupleImageInInvitation(
    invitationId: string,
    field: "groomImage" | "brideImage",
    url: string
  ): void;
  updateQuoteInInvitation: (
    invitationId: string,
    updatedQuote: Partial<Invitation["quote"]>
  ) => void;
  deleteQuoteInInvitation: (invitationId: string) => void;
  updateMusicInInvitation: (
    invitationId: string,
    updatedMusic: Partial<Invitation["music"]>
  ) => void;
  updateThemeInInvitation: (
    invitationId: string,
    updatedTheme: Partial<Invitation["theme"]>
  ) => void;
  addOrUpdateBankAccountToInvitation: (
    invitationId: string,
    bankAccount: BankAccount
  ) => void;
  deleteBankAccountFromInvitation: (
    invitationId: string,
    bankAccountId: string
  ) => void;
  addOrUpdateScheduleToInvitation: (
    invitationId: string,
    schedule: Schedule
  ) => void;
  deleteScheduleFromInvitation: (
    invitationId: string,
    scheduleId: string
  ) => void;
  addOrUpdateStoryToInvitation: (invitationId: string, story: Story) => void;
  deleteStoryFromInvitation: (invitationId: string, storyId: string) => void;
  addGalleryToInvitation: (invitationId: string, gallery: Gallery) => void;
  deleteGalleryFromInvitation: (
    invitationId: string,
    galleryId: string
  ) => void;
}

const useInvitationStore = create<InvitationState>((set) => ({
  invitations: [],
  setInvitations: (invitations) => set({ invitations }),
  addInvitationAtFirst: (newInvitation) =>
    set((state) => ({
      invitations: [newInvitation, ...state.invitations],
    })),
  updateCoupleInInvitation: (invitationId, updatedCouple) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const existingCouple = invitation.couple ?? {
          id: "",
          invitationId: "",
          groomName: "",
          groomFather: "",
          groomMother: "",
          groomImage: "",
          brideName: "",
          brideFather: "",
          brideMother: "",
          brideImage: "",
          createdAt: "",
          updatedAt: "",
        };

        return {
          ...invitation,
          couple: {
            ...existingCouple,
            ...updatedCouple,
          },
        };
      }),
    })),
  updateCoupleImageInInvitation: (
    invitationId: string,
    field: "groomImage" | "brideImage",
    imageUrl: string
  ) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const existingCouple = invitation.couple ?? {
          id: "",
          invitationId: "",
          groomName: "",
          groomFather: "",
          groomMother: "",
          groomImage: "",
          brideName: "",
          brideFather: "",
          brideMother: "",
          brideImage: "",
          createdAt: "",
          updatedAt: "",
        };

        return {
          ...invitation,
          couple: {
            ...existingCouple,
            [field]: imageUrl,
          },
        };
      }),
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
  updateThemeInInvitation: (invitationId, updatedTheme) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const existingTheme = invitation.theme ?? {
          id: "",
          name: "",
          thumbnail: "",
          colorTag: "",
          originalPrice: 0,
          discount: 0,
          isPercent: true,
          createdAt: "",
          updatedAt: "",
        };

        return {
          ...invitation,
          theme: {
            ...existingTheme,
            ...updatedTheme,
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
  addOrUpdateScheduleToInvitation: (invitationId, schedule) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const existingSchedules = invitation.schedules ?? [];

        const existingIndex = existingSchedules.findIndex(
          (acc) => acc.id === schedule.id
        );

        let updatedSchedules;

        if (existingIndex !== -1) {
          updatedSchedules = [...existingSchedules];
          updatedSchedules[existingIndex] = {
            ...existingSchedules[existingIndex],
            ...schedule,
          };
        } else {
          updatedSchedules = [...existingSchedules, schedule];
        }

        updatedSchedules.sort((a, b) => {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return dateA - dateB;
        });

        return {
          ...invitation,
          schedules: updatedSchedules,
        };
      }),
    })),

  deleteScheduleFromInvitation: (invitationId, scheduleId) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const updatedSchedules =
          invitation.schedules?.filter((acc) => acc.id !== scheduleId) ?? [];

        return {
          ...invitation,
          schedules: updatedSchedules,
        };
      }),
    })),
  addOrUpdateStoryToInvitation: (invitationId, story) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const existingStories = invitation.stories ?? [];

        const existingIndex = existingStories.findIndex(
          (acc) => acc.id === story.id
        );

        let updatedStories;

        if (existingIndex !== -1) {
          updatedStories = [...existingStories];
          updatedStories[existingIndex] = {
            ...existingStories[existingIndex],
            ...story,
          };
        } else {
          updatedStories = [...existingStories, story];
        }

        updatedStories.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA - dateB;
        });

        return {
          ...invitation,
          stories: updatedStories,
        };
      }),
    })),

  deleteStoryFromInvitation: (invitationId, storyId) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const updatedStories =
          invitation.stories?.filter((acc) => acc.id !== storyId) ?? [];

        return {
          ...invitation,
          stories: updatedStories,
        };
      }),
    })),
  addGalleryToInvitation: (invitationId, gallery) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const existingGalleries = invitation.galleries ?? [];

        const alreadyExists = existingGalleries.some(
          (g) => g.id === gallery.id
        );
        if (alreadyExists) return invitation;

        return {
          ...invitation,
          galleries: [...existingGalleries, gallery],
        };
      }),
    })),

  deleteGalleryFromInvitation: (invitationId, galleryId) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const updatedGalleries =
          invitation.galleries?.filter((g) => g.id !== galleryId) ?? [];

        return {
          ...invitation,
          galleries: updatedGalleries,
        };
      }),
    })),
}));

export default useInvitationStore;
