"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import QuoteForm from "./quote-form";
import useUserInvitations from "@/hooks/use-user-invitation";

interface QuoteContentProps {
  params: {
    id: string;
  };
}

const QuoteContent: React.FC<QuoteContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);

  return (
    <>
      <NavigationBack href={`/admin/master-data/themes/${params.id}`} />
      <div>
        <Heading
          title="Quote"
          description="Ungkapkan kisah cinta kalian melalui kutipan manis"
        />
      </div>
      <div>
        <QuoteForm
          params={params}
          initialData={invitation}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default QuoteContent;
