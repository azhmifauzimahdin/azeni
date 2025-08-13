"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import useAdminReferralCode from "@/hooks/use-admin-referral";
import NavigationBack from "@/components/ui/navigation-back";
import ReferralCodeWithdrawalForm from "./referral-code-withdrawal-form";

interface ReferralCodeWithdrawalContentProps {
  params: {
    referralId: string;
  };
}

const ReferralCodeWithdrawalContent: React.FC<
  ReferralCodeWithdrawalContentProps
> = ({ params }) => {
  const { getReferralCodeByCode, isFetching } = useAdminReferralCode();
  const transaction = getReferralCodeByCode(params.referralId);

  return (
    <>
      <NavigationBack href="/admin/referral-code/referral" />
      <div>
        <Heading title={`Riwayat Penarikan - ${params.referralId}`} />
      </div>
      <div>
        <ReferralCodeWithdrawalForm
          initialData={transaction?.withdrawals}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default ReferralCodeWithdrawalContent;
