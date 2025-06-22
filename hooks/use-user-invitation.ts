import { InvitationService } from "@/lib/services";
import useInvitationStore from "@/stores/invitation-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useUserInvitations = () => {
  const user = useUserStore((state) => state.user);
  const invitations = useInvitationStore((state) => state.invitations);
  const setInvitations = useInvitationStore((state) => state.setInvitations);
  const [isFetching, setIsFetching] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await InvitationService.fetchInvitationByUserId(user.id);
      setInvitations(res);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, setInvitations]);

  const getInvitationById = useCallback(
    (id: string) => {
      return invitations.find((invitation) => invitation.id === id);
    },
    [invitations]
  );

  useEffect(() => {
    if (user && invitations.length === 0) {
      fetchData();
    } else {
      setIsFetching(false);
    }
  }, [user, invitations.length, fetchData]);

  return { invitations, isFetching, refetch: fetchData, getInvitationById };
};

export default useUserInvitations;
