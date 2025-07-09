"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
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
          initialData={invitation}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default GuestBookContent;
