"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import SettingForm from "./setting-form";
import useAdminInvitations from "@/hooks/use-admin-invitation";

interface SettingContentProps {
  params: {
    id: string;
  };
}

const SettingContent: React.FC<SettingContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useAdminInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/admin/invitations/${params.id}`} />
      <div>
        <Heading
          title="Pengaturan"
          description="Kelola semua pengaturan penting untuk undangan digital Anda"
        />
      </div>
      <div>
        <SettingForm
          params={params}
          initialData={invitation}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default SettingContent;
