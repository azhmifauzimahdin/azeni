"use client";

import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { InvitationService } from "@/lib/services";
import { LinkButton } from "@/components/ui/link";
import InvitationList from "./components/invitation-list";
import useUserStore from "@/stores/user-store";
import useInvitationStore from "@/stores/invitation-store";

export default function InvitationsPage() {
  const user = useUserStore((state) => state.user);
  const [isFetching, setIsFetching] = useState(false);
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
    }
  }, [invitations.length, setInvitations, user]);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <Heading title="Undangan" description="Atur Undangan" />
        <LinkButton href="/dashboard/invitation/new" variant="primary">
          <Plus className="mr-2" size={16} />
          Buat Undangan
        </LinkButton>
      </div>
      <div>
        <InvitationList invitations={invitations} isFetching={isFetching} />
      </div>
    </>
  );
}
