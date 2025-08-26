"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import useUserInvitations from "@/hooks/use-user-invitation";
import LiveStreamForm from "./live-stream-form";

interface LiveStreamContentProps {
  params: {
    id: string;
  };
}

const LiveStreamContent: React.FC<LiveStreamContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/dashboard/invitation/${params.id}`} />
      <div>
        <Heading
          title="Streaming"
          description="Kelola jadwal dan link siaran langsung dengan mudah"
        />
      </div>
      <div>
        <LiveStreamForm
          params={params}
          initialData={invitation}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default LiveStreamContent;
