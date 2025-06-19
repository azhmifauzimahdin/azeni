"use client";

import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useState } from "react";
import { LinkButton } from "@/components/ui/link";
import InvitationList from "./invitation-list";
import { Pagination } from "@/components/ui/pagination";
import useUserInvitations from "@/hooks/use-user-invitation";

export default function InvitationContent() {
  const { invitations, isFetching } = useUserInvitations();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(invitations.length / postsPerPage);

  const currentInvitations = invitations.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <>
      <div className="flex gap-5 md:items-center flex-col md:flex-row justify-between">
        <Heading
          title="Undangan"
          description="Mulai persiapkan undangan pernikahanmu"
        />
        <LinkButton href="/dashboard/invitation/new" variant="primary">
          <Plus className="mr-2" size={16} />
          Buat Undangan
        </LinkButton>
      </div>
      <div>
        <InvitationList
          invitations={currentInvitations}
          isFetching={isFetching}
        />
      </div>
      <div className="mt-8 flex-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          siblingCount={1}
        />
      </div>
    </>
  );
}
