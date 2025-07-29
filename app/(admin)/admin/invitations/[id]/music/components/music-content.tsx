"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import MusicForm from "./music-form";
import useAdminInvitations from "@/hooks/use-admin-invitation";

interface MusicContentProps {
  params: {
    id: string;
  };
}

const MusicContent: React.FC<MusicContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useAdminInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/admin/invitations/${params.id}`} />
      <div>
        <Heading
          title="Musik"
          description="Dengarkan dan pilih musik yang paling cocok untukmu"
        />
      </div>
      <div>
        <MusicForm
          params={params}
          initialData={invitation}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default MusicContent;
