"use client";

import { Heading } from "@/components/ui/heading";
import React, { useEffect, useState } from "react";
import useInvitationStore from "@/stores/invitation-store";
import useUserStore from "@/stores/user-store";
import { InvitationService } from "@/lib/services";

interface QuoteContentProps {
  params: {
    id: string;
  };
}

const QuoteContent: React.FC<QuoteContentProps> = ({ params }) => {
  const user = useUserStore((state) => state.user);
  const [isFetching, setIsFetching] = useState(true);
  const getInvitationById = useInvitationStore(
    (state) => state.getInvitationById
  );
  const invitations = useInvitationStore((state) => state.invitations);
  const setInvitations = useInvitationStore((state) => state.setInvitations);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const res = await InvitationService.fetchInvitationByUserId(user.id);
        setInvitations(res);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsFetching(false);
      }
    };
    if (invitations.length === 0) {
      fetchData();
    } else {
      setIsFetching(false);
    }
  }, [invitations.length, setInvitations, user]);

  const invitation = getInvitationById(params.id);

  return (
    <>
      <div>
        <Heading
          title={`Undangan ${invitation?.groom} & ${invitation?.bride}`}
          description="Kelola undangan digital Anda dengan mudah dan efisien"
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default QuoteContent;
