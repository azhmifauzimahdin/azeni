"use client";

import React from "react";
import ScanForm from "./scan-form";
import useUserInvitations from "@/hooks/use-user-invitation";

interface ScanContentProps {
  params: {
    id: string;
  };
}

const ScanContent: React.FC<ScanContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);
  return (
    <>
      <div>
        <ScanForm
          params={params}
          initialData={invitation}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default ScanContent;
