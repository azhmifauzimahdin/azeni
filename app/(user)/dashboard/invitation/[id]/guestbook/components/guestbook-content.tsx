"use client";

import { Heading } from "@/components/ui/heading";
import React, { useMemo } from "react";
import NavigationBack from "@/components/ui/navigation-back";
import useUserInvitations from "@/hooks/use-user-invitation";
import GuestBookForm from "./guestbook-form";

interface GuestBookContentProps {
  params: {
    id: string;
  };
}

const GuestBookContent: React.FC<GuestBookContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);

  const filteredInvitation = useMemo(() => {
    if (!invitation?.guests?.length) return undefined;

    const earliest = invitation.guests.reduce((min, curr) =>
      new Date(curr.createdAt) < new Date(min.createdAt) ? curr : min
    );

    return {
      ...invitation,
      guests: invitation.guests.filter((g) => g.id !== earliest.id),
    };
  }, [invitation]);

  return (
    <>
      <NavigationBack href={`/dashboard/invitation/${params.id}`} />
      <div>
        <Heading
          title="Buku Tamu"
          description="Demi menjaga privasi, kami tidak menyimpan nomor telepon undangan"
        />
      </div>
      <div>
        <GuestBookForm
          params={params}
          initialData={filteredInvitation}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default GuestBookContent;
