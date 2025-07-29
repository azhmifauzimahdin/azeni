"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import GalleryForm from "./gallery-form";
import useAdminInvitations from "@/hooks/use-admin-invitation";

interface GalleryContentProps {
  params: {
    id: string;
  };
}

const GalleryContent: React.FC<GalleryContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useAdminInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/admin/invitations/${params.id}`} />
      <div>
        <Heading
          title="Galeri"
          description="Lengkapi galeri undangan dengan foto terbaik Anda"
        />
      </div>
      <div>
        <GalleryForm
          params={params}
          initialData={invitation}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default GalleryContent;
