import {
  BankAccount,
  Gallery,
  Guest,
  Invitation,
  Schedule,
  Story,
  Transaction,
} from "@/types";
import { create } from "zustand";

interface InvitationState {
  invitations: Invitation[];
  setInvitations: (invitation: Invitation[]) => void;
  addInvitationAtFirst: (newInvitation: Invitation) => void;
  deleteInvitationById: (invitationId: string) => void;
  updateTransactionInInvitation: (
    invitationId: string,
    updatedTransaction: Partial<Transaction>
  ) => void;
  updateTransactionStatusName: (
    invitationId: string,
    statusName: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED"
  ) => void;
  updateSlugInInvitation: (invitationId: string, slug: string) => void;
  updateDateInInvitation: (
    invitationId: string,
    date: string,
    useScheduleDate: boolean
  ) => void;
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
  updateSettingInInvitation: (
    invitationId: string,
    updatedSetting: Partial<Invitation["setting"]>
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
  addOrUpdateGuestToInvitation: (invitationId: string, guest: Guest) => void;
  deleteGuestFromInvitation: (invitationId: string, guestId: string) => void;
  checkInGuestInInvitation: (
    invitationId: string,
    guestId: string,
    time: string
  ) => void;
  checkOutGuestInInvitation: (
    invitationId: string,
    guestId: string,
    time: string
  ) => void;
  addOrUpdateStoryToInvitation: (invitationId: string, story: Story) => void;
  deleteStoryFromInvitation: (invitationId: string, storyId: string) => void;
  addGalleryToInvitation: (invitationId: string, gallery: Gallery) => void;
  deleteGalleryFromInvitation: (
    invitationId: string,
    galleryId: string
  ) => void;
}

const useAdminInvitationStore = create<InvitationState>((set) => ({
  invitations: [],
  setInvitations: (invitations) => set({ invitations }),
  addInvitationAtFirst: (newInvitation) =>
    set((state) => ({
      invitations: [newInvitation, ...state.invitations],
    })),
  updateTransactionInInvitation: (invitationId, updatedTransaction) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const existingTransaction = invitation.transaction ?? {
          id: "",
          orderId: "",
          status: "PENDING",
          amount: 0,
          method: null,
          paidAt: null,
          createdAt: "",
          updatedAt: "",
          invitationId: invitationId,
          referralCode: null,
          referral: null,
        };

        return {
          ...invitation,
          transaction: {
            ...existingTransaction,
            ...updatedTransaction,
          },
        };
      }),
    })),
  updateTransactionStatusName: (invitationId, statusName) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id === invitationId && invitation.transaction) {
          return {
            ...invitation,
            transaction: {
              ...invitation.transaction,
              status: {
                ...invitation.transaction.status,
                name: statusName,
              },
            },
          };
        }
        return invitation;
      }),
    })),
  deleteInvitationById: (invitationId) =>
    set((state) => ({
      invitations: state.invitations.filter(
        (invitation) => invitation.id !== invitationId
      ),
    })),
  updateSlugInInvitation: (invitationId, slug) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) =>
        invitation.id === invitationId
          ? {
              ...invitation,
              slug,
            }
          : invitation
      ),
    })),
  updateDateInInvitation: (invitationId, date, useScheduleDate) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) =>
        invitation.id === invitationId
          ? {
              ...invitation,
              date,
              useScheduleDate,
            }
          : invitation
      ),
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
  updateSettingInInvitation: (invitationId, updateSetting) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const existingSetting = invitation.setting ?? {
          id: "",
          invitationId: "",
          invitationEnabled: true,
          rsvpEnabled: true,
          rsvpMaxGuests: 1,
          rsvpDeadline: new Date(),
          rsvpAllowNote: true,
          commentEnabled: true,
          whatsappMessageTemplate: "",
          scanResetCountdownSeconds: 5,
          checkinCheckoutEnabled: true,
          coupleIntroductionText: "",
          scheduleIntroductionText: "",
          giftIntroductionText: "",
          rsvpIntroductionText: "",
          updatedAt: "",
          createdAt: "",
        };

        return {
          ...invitation,
          setting: {
            ...existingSetting,
            ...updateSetting,
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
          originalPrice: "",
          discount: "",
          isPercent: true,
          createdAt: "",
          updatedAt: "",
          categoryId: "",
          category: {
            id: "",
            name: "",
            createdAt: "",
            updatedAt: "",
          },
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
  addOrUpdateGuestToInvitation: (invitationId, guest) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const existingGuest = invitation.guests ?? [];

        const existingIndex = existingGuest.findIndex(
          (acc) => acc.id === guest.id
        );

        let updatedGuest;

        if (existingIndex !== -1) {
          updatedGuest = [...existingGuest];
          updatedGuest[existingIndex] = {
            ...existingGuest[existingIndex],
            ...guest,
          };
        } else {
          updatedGuest = [guest, ...existingGuest];
        }

        return {
          ...invitation,
          guests: updatedGuest,
        };
      }),
    })),

  deleteGuestFromInvitation: (invitationId, guestId) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const updatedGuest =
          invitation.guests?.filter((acc) => acc.id !== guestId) ?? [];

        return {
          ...invitation,
          guests: updatedGuest,
        };
      }),
    })),
  checkInGuestInInvitation: (invitationId, guestId, time) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const updatedGuests = invitation.guests.map((guest) =>
          guest.id === guestId
            ? {
                ...guest,
                isCheckedIn: true,
                checkedInAt: time,
              }
            : guest
        );

        return {
          ...invitation,
          guests: updatedGuests,
        };
      }),
    })),

  checkOutGuestInInvitation: (invitationId, guestId, time) =>
    set((state) => ({
      invitations: state.invitations.map((invitation) => {
        if (invitation.id !== invitationId) return invitation;

        const updatedGuests = invitation.guests.map((guest) =>
          guest.id === guestId
            ? {
                ...guest,
                checkedOutAt: time,
              }
            : guest
        );

        return {
          ...invitation,
          guests: updatedGuests,
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

export default useAdminInvitationStore;
