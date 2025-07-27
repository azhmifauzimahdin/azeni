"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import useUserInvitations from "@/hooks/use-user-invitation";
import GiftForm from "./gift-form";

interface GiftContentProps {
  params: {
    id: string;
  };
}

const GiftContent: React.FC<GiftContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/admin/master-data/themes/${params.id}`} />
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
