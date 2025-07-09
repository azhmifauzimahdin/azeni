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
      label: "Setting",
      icon: "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291125/settings_sfbujg.png",
      href: `${params.id}/setting`,
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
