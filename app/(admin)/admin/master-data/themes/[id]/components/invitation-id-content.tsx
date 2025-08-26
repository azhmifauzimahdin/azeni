"use client";

import React, { useEffect } from "react";
import InvitationIdList from "./invitation-id-list";
import useUserInvitations from "@/hooks/use-user-invitation";
import NavigationBack from "@/components/ui/navigation-back";
import useUserMusics from "@/hooks/use-user-music";
import useUserBanks from "@/hooks/use-user-bank";
import { InvitationService, SettingService } from "@/lib/services";
import useUserQuoteTemplates from "@/hooks/use-user-quote-template";
import { useRouter } from "next/navigation";
import InvitationOverview from "./invitation-id-overview";
import toast from "react-hot-toast";
import useInvitationStore from "@/stores/invitation-store";

interface InvitationIdContentProps {
  params: {
    id: string;
  };
}

const InvitationIdContent: React.FC<InvitationIdContentProps> = ({
  params,
}) => {
  const router = useRouter();

  const { getInvitationById, isFetching } = useUserInvitations();
  useUserMusics();
  useUserBanks();
  useUserQuoteTemplates();

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
      icon: "/assets/img/couple.png",
      href: `${params.id}/couple`,
    },
    {
      id: "2",
      label: "Quote",
      icon: "/assets/img/quote.png",
      href: `${params.id}/quote`,
    },
    {
      id: "3",
      label: "Acara",
      icon: "/assets/img/schedule.png",
      href: `${params.id}/schedule`,
    },
    {
      id: "4",
      label: "Cerita Kita",
      icon: "/assets/img/love-story.png",
      href: `${params.id}/our-story`,
    },
    {
      id: "5",
      label: "Galeri",
      icon: "/assets/img/gallery.png",
      href: `${params.id}/gallery`,
    },
    {
      id: "6",
      label: "Kado",
      icon: "/assets/img/gift.png",
      href: `${params.id}/gift`,
    },
    {
      id: "7",
      label: "Musik",
      icon: "/assets/img/music.png",
      href: `${params.id}/music`,
    },
    {
      id: "8",
      label: "Streaming",
      icon: "/assets/img/streaming.png",
      href: `${params.id}/live-stream`,
    },
    {
      id: "9",
      label: "Pengaturan",
      icon: "/assets/img/settings.png",
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
      <NavigationBack href="/admin/master-data/themes" />
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
