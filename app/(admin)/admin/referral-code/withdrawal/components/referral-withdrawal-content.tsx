"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import ReferralWithdrawalForm from "./referral-withdrawal-form";
import useAdminReferralWithdrawal from "@/hooks/use-admin-referral-withdrawal";
import useAdminBanks from "@/hooks/use-admin-bank";
import useAdminReferralCode from "@/hooks/use-admin-referral";

const ReferralWithdrawalContent: React.FC = () => {
  const { withdrawals, isFetching } = useAdminReferralWithdrawal();
  useAdminReferralCode();
  useAdminBanks();

  return (
    <>
      <div>
        <Heading title="Penarikan Dana" />
      </div>
      <div>
        <ReferralWithdrawalForm
          initialData={withdrawals}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default ReferralWithdrawalContent;
