"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import ReferralCodesForm from "./referral-code-form";
import useAdminReferralCode from "@/hooks/use-admin-referral";
import useAdminBanks from "@/hooks/use-admin-bank";
import useAdminReferralWithdrawal from "@/hooks/use-admin-referral-withdrawal";

const ReferralCodesContent: React.FC = () => {
  const { referralCodes, isFetching } = useAdminReferralCode();
  const { banks } = useAdminBanks();
  useAdminReferralWithdrawal();

  return (
    <>
      <div>
        <Heading title="Kode Referral" />
      </div>
      <div>
        <ReferralCodesForm
          initialData={referralCodes}
          banks={banks || []}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default ReferralCodesContent;
