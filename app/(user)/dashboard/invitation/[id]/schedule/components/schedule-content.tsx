"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import useUserInvitations from "@/hooks/use-user-invitation";
import ScheduleForm from "./schedule-form";

interface ScheduleContentProps {
  params: {
    id: string;
  };
}

const ScheduleContent: React.FC<ScheduleContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/dashboard/invitation/${params.id}`} />
      <div>
        <Heading
          title="Jadwal Acara"
          description="Dari akad hingga resepsi, catat semua momen penting di sini"
        />
      </div>
      <div>
        <ScheduleForm
          params={params}
          initialData={invitation}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default ScheduleContent;
