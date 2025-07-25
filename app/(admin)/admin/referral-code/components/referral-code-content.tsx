"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import ReferralCodesForm from "./referral-code-form";
import useAdminReferralCode from "@/hooks/use-admin-referral";

const ReferralCodesContent: React.FC = () => {
  const { referralCodes, isFetching } = useAdminReferralCode();

  return (
    <>
      <div>
        <Heading title="Kode Referral" />
      </div>
      <div>
        <ReferralCodesForm
          initialData={referralCodes}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default ReferralCodesContent;
