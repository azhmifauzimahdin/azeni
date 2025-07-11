"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import useUserInvitations from "@/hooks/use-user-invitation";
import RSVPForm from "./rsvp-form";

interface RSVPContentProps {
  params: {
    id: string;
  };
}

const RSVPContent: React.FC<RSVPContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/dashboard/invitation/${params.id}`} />
      <div>
        <Heading
          title="RSVP"
          description="Statistik dan data terkini mengenai respons undangan"
        />
      </div>
      <div>
        <RSVPForm
          params={params}
          initialData={invitation}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default RSVPContent;
