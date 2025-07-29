"use client";

import { Heading } from "@/components/ui/heading";
import React, { useMemo } from "react";
import NavigationBack from "@/components/ui/navigation-back";
import GuestBookForm from "./guestbook-form";
import useAdminInvitations from "@/hooks/use-admin-invitation";

interface GuestBookContentProps {
  params: {
    id: string;
  };
}

const GuestBookContent: React.FC<GuestBookContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useAdminInvitations();
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
      <NavigationBack href={`/admin/invitations/${params.id}`} />
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
