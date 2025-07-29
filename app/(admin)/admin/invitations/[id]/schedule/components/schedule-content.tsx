"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import ScheduleForm from "./schedule-form";
import useAdminInvitations from "@/hooks/use-admin-invitation";

interface ScheduleContentProps {
  params: {
    id: string;
  };
}

const ScheduleContent: React.FC<ScheduleContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useAdminInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/admin/invitations/${params.id}`} />
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
