"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import GiftForm from "./gift-form";
import useAdminInvitations from "@/hooks/use-admin-invitation";

interface GiftContentProps {
  params: {
    id: string;
  };
}

const GiftContent: React.FC<GiftContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useAdminInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/admin/invitations/${params.id}`} />
      <div>
        <Heading
          title="Kado"
          description="Atur rekening penerima dan alamat pengiriman kado"
        />
      </div>
      <div>
        <GiftForm
          params={params}
          initialData={invitation}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default GiftContent;
