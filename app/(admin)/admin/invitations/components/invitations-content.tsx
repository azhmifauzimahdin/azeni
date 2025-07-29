"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import InvitationsForm from "./invitations-form";
import useAdminInvitations from "@/hooks/use-admin-invitation";

const InvitationsContent: React.FC = () => {
  const { invitations, isFetching } = useAdminInvitations();

  return (
    <>
      <div>
        <Heading title="Undangan" />
      </div>
      <div>
        <InvitationsForm initialData={invitations} isFetching={isFetching} />
      </div>
    </>
  );
};

export default InvitationsContent;
