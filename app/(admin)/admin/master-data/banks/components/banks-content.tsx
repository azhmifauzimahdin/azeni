"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import useAdminBanks from "@/hooks/use-admin-bank";
import BanksForm from "./banks-form";

const BanksContent: React.FC = () => {
  const { banks, isFetching } = useAdminBanks();

  return (
    <>
      <div>
        <Heading title="Bank" />
      </div>
      <div>
        <BanksForm initialData={banks} isFetching={isFetching} />
      </div>
    </>
  );
};

export default BanksContent;
