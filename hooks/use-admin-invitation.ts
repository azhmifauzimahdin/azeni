import { InvitationService } from "@/lib/services";
import useAdminInvitationStore from "@/stores/admin-invitation-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useAdminInvitations = () => {
  const user = useUserStore((state) => state.user);
  const invitations = useAdminInvitationStore((state) => state.invitations);
  const setInvitations = useAdminInvitationStore(
    (state) => state.setInvitations
  );
  const [isFetching, setIsFetching] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await InvitationService.fetchInvitation();
      setInvitations(res.data);
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

export default useAdminInvitations;
