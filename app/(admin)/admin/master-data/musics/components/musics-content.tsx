"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import MusicsForm from "./musics-form";
import useAdminMusics from "@/hooks/use-admin-music";

const MusicsContent: React.FC = () => {
  const { musics, isFetching } = useAdminMusics();

  return (
    <>
      <div>
        <Heading title="Musik" />
      </div>
      <div>
        <MusicsForm initialData={musics} isFetching={isFetching} />
      </div>
    </>
  );
};

export default MusicsContent;
