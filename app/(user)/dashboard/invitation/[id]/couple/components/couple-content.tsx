"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import useUserInvitations from "@/hooks/use-user-invitation";
import CoupleForm from "./couple-form";

interface CoupleContentProps {
  params: {
    id: string;
  };
}

const CoupleContent: React.FC<CoupleContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/dashboard/invitation/${params.id}`} />
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
