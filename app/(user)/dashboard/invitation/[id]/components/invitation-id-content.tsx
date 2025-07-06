"use client";

import { Heading } from "@/components/ui/heading";
import React, { useEffect } from "react";
import InvitationIdList from "./invitation-id-list";
import useUserInvitations from "@/hooks/use-user-invitation";
import NavigationBack from "@/components/ui/navigation-back";
import useUserMusics from "@/hooks/use-user-music";
import useUserBanks from "@/hooks/use-user-bank";
import useThemes from "@/hooks/use-theme";
import { InvitationService } from "@/lib/services";
import useUserQuoteTemplates from "@/hooks/use-user-quote-template";
import { useRouter } from "next/navigation";

interface InvitationIdContentProps {
  params: {
    id: string;
  };
}

const InvitationIdContent: React.FC<InvitationIdContentProps> = ({
  params,
}) => {
  const router = useRouter();

  const { getInvitationById } = useUserInvitations();
  useUserMusics();
  useUserBanks();
  useUserQuoteTemplates();
  useThemes();

  const invitation = getInvitationById(params.id);

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
      label: "Tema",
      icon: "/assets/img/theme.png",
      href: `${params.id}/theme`,
    },
    {
      id: "3",
      label: "Acara",
      icon: "/assets/img/schedule.png",
      href: `${params.id}/schedule`,
    },
    {
      id: "4",
      label: "Musik",
      icon: "/assets/img/music.png",
      href: `${params.id}/music`,
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
      label: "RSVP",
      icon: "/assets/img/rsvp.png",
      href: `${params.id}/rsvp`,
    },
    {
      id: "8",
      label: "Kisah Cinta",
      icon: "/assets/img/love-story.png",
      href: `${params.id}/love-story`,
    },
    {
      id: "9",
      label: "Quote",
      icon: "/assets/img/quote.png",
      href: `${params.id}/quote`,
    },
    {
      id: "10",
      label: "Setting",
      icon: "/assets/img/settings.png",
      href: `${params.id}/setting`,
    },
    {
      id: "11",
      label: "Buku Tamu",
      icon: "/assets/img/guestbook.png",
      href: `${params.id}/guestbook`,
    },
    {
      id: "12",
      label: "Kirim",
      icon: "/assets/img/send.png",
      href: `${params.id}/send`,
    },
  ];

  return (
    <>
      <NavigationBack href="/dashboard/invitation" />
      <div>
        <Heading
          title={`Undangan ${invitation?.groom || ""} ${
            invitation?.groom ? "&" : ""
          } ${invitation?.bride || ""}`}
          description="Kelola undangan digital Anda dengan mudah dan efisien"
        />
      </div>
      <div>
        <InvitationIdList sections={sections} />
      </div>
    </>
  );
};

export default InvitationIdContent;
