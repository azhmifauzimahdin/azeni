"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import useUserInvitations from "@/hooks/use-user-invitation";
import OurStoryForm from "./our-story-form";

interface OurStoryContentProps {
  params: {
    id: string;
  };
}

const OurStoryContent: React.FC<OurStoryContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/admin/master-data/themes/${params.id}`} />
      <div>
        <Heading
          title="Kisah Kita"
          description="Tulis cerita dari awal bertemu hingga ke jenjang pernikahan"
        />
      </div>
      <div>
        <OurStoryForm
          params={params}
          initialData={invitation}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default OurStoryContent;
