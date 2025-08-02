"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import useUserInvitations from "@/hooks/use-user-invitation";
import MusicForm from "./music-form";
import { Alert } from "@/components/ui/alert";

interface MusicContentProps {
  params: {
    id: string;
  };
}

const MusicContent: React.FC<MusicContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/dashboard/invitation/${params.id}`} />
      <div>
        <Heading
          title="Musik"
          description="Dengarkan dan pilih musik yang paling cocok untukmu"
        />
      </div>
      <Alert>
        Pastikan tema undangan kamu sudah sesuai, karena mengganti tema akan
        secara otomatis mengubah musik menjadi bawaan tema tersebut.
      </Alert>
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
