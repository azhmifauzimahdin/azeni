"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import ReferralCodeIdForm from "./referral-code-id-form";
import useAdminReferralCode from "@/hooks/use-admin-referral";
import NavigationBack from "@/components/ui/navigation-back";

interface ReferralCodeIdContentProps {
  params: {
    referralId: string;
  };
}

const ReferralCodeIdContent: React.FC<ReferralCodeIdContentProps> = ({
  params,
}) => {
  const { getReferralCodeByCode, isFetching } = useAdminReferralCode();
  const transactions = getReferralCodeByCode(params.referralId);

  return (
    <>
      <NavigationBack href="/admin/referral-code" />
      <div>
        <Heading title={`Transaksi - ${params.referralId}`} />
      </div>
      <div>
        <ReferralCodeIdForm
          initialData={transactions?.transactions}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default ReferralCodeIdContent;
