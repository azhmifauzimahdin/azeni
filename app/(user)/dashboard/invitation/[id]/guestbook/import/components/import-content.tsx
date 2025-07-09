"use client";

import { Heading } from "@/components/ui/heading";
import React from "react";
import NavigationBack from "@/components/ui/navigation-back";
import ImportGuestBookForm from "./import-form";

interface ImportGuestBookContentProps {
  params: {
    id: string;
  };
}

const ImportGuestBookContent: React.FC<ImportGuestBookContentProps> = ({
  params,
}) => {
  return (
    <>
      <NavigationBack href={`/dashboard/invitation/${params.id}/guestbook`} />
      <div>
        <Heading
          title="Import Tamu"
          description="Unggah file Excel untuk mengisi buku tamu dengan cepat dan mudah"
        />
      </div>
      <div>
        <ImportGuestBookForm params={params} />
      </div>
    </>
  );
};

export default ImportGuestBookContent;
