"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import CoupleForm from "./couple-form";
import useAdminInvitations from "@/hooks/use-admin-invitation";

interface CoupleContentProps {
  params: {
    id: string;
  };
}

const CoupleContent: React.FC<CoupleContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useAdminInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/admin/invitations/${params.id}`} />
      <div>
        <Heading
          title="Pengantin"
          description="Lengkapi informasi penting untuk undangan pernikahanmu"
        />
      </div>
      <div>
        <CoupleForm
          initialData={invitation}
          params={params}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default CoupleContent;
