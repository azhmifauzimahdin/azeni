"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import ReferralCodeLogForm from "./referral-code-log-form";
import useAdminReferralCode from "@/hooks/use-admin-referral";
import NavigationBack from "@/components/ui/navigation-back";

interface ReferralCodeLogContentProps {
  params: {
    referralId: string;
  };
}

const ReferralCodeLogContent: React.FC<ReferralCodeLogContentProps> = ({
  params,
}) => {
  const { getReferralCodeByCode, isFetching } = useAdminReferralCode();
  const transaction = getReferralCodeByCode(params.referralId);

  return (
    <>
      <NavigationBack href="/admin/referral-code" />
      <div>
        <Heading title={`Histori - ${params.referralId}`} />
      </div>
      <div>
        <ReferralCodeLogForm
          initialData={transaction?.referralCodeLogs}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default ReferralCodeLogContent;
