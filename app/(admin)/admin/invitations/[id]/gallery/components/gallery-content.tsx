"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import GalleryForm from "./gallery-form";
import useAdminInvitations from "@/hooks/use-admin-invitation";
import { Alert } from "@/components/ui/alert";

interface GalleryContentProps {
  params: {
    id: string;
  };
}

const GalleryContent: React.FC<GalleryContentProps> = ({ params }) => {
  const { getInvitationById, isFetching } = useAdminInvitations();
  const invitation = getInvitationById(params.id);
  const maxGalleries =
    (invitation?.galleries ?? []).length >=
    Number(process.env.NEXT_PUBLIC_MAX_GALLERIES);
  const isModalThemeImageNeeded = invitation?.theme?.name
    .toLowerCase()
    .includes("luxury");

  return (
    <>
      <NavigationBack href={`/admin/invitations/${params.id}`} />
      <div>
        <Heading
          title="Galeri"
          description="Lengkapi galeri undangan dengan foto terbaik Anda"
        />
      </div>
      {maxGalleries && (
        <Alert variant="destructive">
          Batas maksimum galeri tercapai&nbsp;
          <span className="font-bold">
            ({process.env.NEXT_PUBLIC_MAX_GALLERIES} foto)
          </span>
          . Hapus foto lama untuk menambahkan yang baru.
        </Alert>
      )}
      {isModalThemeImageNeeded && (
        <Alert>
          Foto utama akan menjadi background halaman depan undangan. Pastikan
          memilih yang paling berkesan.
        </Alert>
      )}
      <div>
        <GalleryForm
          params={params}
          initialData={invitation}
          isFetching={isFetching}
          isFull={maxGalleries}
        />
      </div>
    </>
  );
};

export default GalleryContent;
