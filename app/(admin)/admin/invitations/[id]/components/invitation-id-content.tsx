"use client";

import React, { useEffect } from "react";
import InvitationIdList from "./invitation-id-list";
import NavigationBack from "@/components/ui/navigation-back";
import useUserMusics from "@/hooks/use-user-music";
import useUserBanks from "@/hooks/use-user-bank";
import { InvitationService, SettingService } from "@/lib/services";
import useUserQuoteTemplates from "@/hooks/use-user-quote-template";
import { useRouter } from "next/navigation";
import InvitationOverview from "./invitation-id-overview";
import toast from "react-hot-toast";
import useInvitationStore from "@/stores/invitation-store";
import useUserThemes from "@/hooks/use-user-theme";
import useAdminInvitations from "@/hooks/use-admin-invitation";

interface InvitationIdContentProps {
  params: {
    id: string;
  };
}

const InvitationIdContent: React.FC<InvitationIdContentProps> = ({
  params,
}) => {
  const router = useRouter();

  const { getInvitationById, isFetching } = useAdminInvitations();
  useUserMusics();
  useUserBanks();
  useUserQuoteTemplates();
  useUserThemes(params.id);

  const invitation = getInvitationById(params.id);

  const updateSettingInInvitation = useInvitationStore(
    (state) => state.updateSettingInInvitation
  );

  useEffect(() => {
    const checkInvitationAvailability = async () => {
      try {
        await InvitationService.fetchInvitationById(params.id);
      } catch {
        router.push("/invitation");
      }
    };

    checkInvitationAvailability();
  }, [params.id, router]);

  const sections = [
    {
      id: "1",
      label: "Pengantin",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291121/couple_olnzsp.png",
      href: `${params.id}/couple`,
    },
    {
      id: "2",
      label: "Quote",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291124/quote_vzwjwb.png",
      href: `${params.id}/quote`,
    },
    {
      id: "3",
      label: "Acara",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291124/schedule_mwwixp.png",
      href: `${params.id}/schedule`,
    },
    {
      id: "4",
      label: "Cerita Kita",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291123/love-story_rc4kbl.png",
      href: `${params.id}/our-story`,
    },
    {
      id: "5",
      label: "Galeri",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291122/gallery_gbcn70.png",
      href: `${params.id}/gallery`,
    },
    {
      id: "6",
      label: "Kado",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291122/gift_trinmg.png",
      href: `${params.id}/gift`,
    },
    {
      id: "7",
      label: "Tema",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291126/theme_ay2axt.png",
      href: `${params.id}/theme`,
    },
    {
      id: "8",
      label: "Musik",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291123/music_wmdan8.png",
      href: `${params.id}/music`,
    },
    {
      id: "9",
      label: "RSVP",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291125/rsvp_x8g0wf.png",
      href: `${params.id}/rsvp`,
    },
    {
      id: "10",
      label: "Buku Tamu",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291124/guestbook_zg9dxt.png",
      href: `${params.id}/guestbook`,
    },
    {
      id: "11",
      label: "Pengaturan",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291125/settings_sfbujg.png",
      href: `${params.id}/setting`,
    },
  ];

  const onToggleActive = async (val: boolean) => {
    try {
      const res = await SettingService.updateInvitationStatus(params.id, {
        invitationEnabled: val,
      });
      updateSettingInInvitation(params.id, res.data);
    } catch {
      toast.error("Gagal update status undangan.");
    }
  };

  return (
    <>
      <NavigationBack href="/dashboard/invitation" />
      <div>
        <InvitationOverview
          onToggleActive={(val) => onToggleActive(val)}
          invitation={invitation}
          params={params}
          isFetching={isFetching}
        />

        <InvitationIdList sections={sections} isFetching={isFetching} />
      </div>
    </>
  );
};

export default InvitationIdContent;
