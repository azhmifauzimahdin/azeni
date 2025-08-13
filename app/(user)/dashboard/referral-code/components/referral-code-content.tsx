"use client";

import { Heading } from "@/components/ui/heading";
import ReferralCodeForm from "./referral-code-form";
import useReferralCode from "@/hooks/use-referral-code";
import useBalanceReferralCode from "@/hooks/use-balance-referral-code";
import useUserBanks from "@/hooks/use-user-bank";

export default function ReferralCodeContent() {
  const { banks } = useUserBanks();
  const { balanceReferralCode, isFetching: isFetchingBalance } =
    useBalanceReferralCode();
  const { referralCode, isFetching: isFetchingReferral } = useReferralCode();

  const loading = isFetchingBalance || isFetchingReferral;

  return (
    <>
      <div>
        <Heading
          title="Kode Referral"
          description="Kelola dan pantau penggunaan kode referral Anda di sini"
        />
      </div>
      <div>
        <ReferralCodeForm
          referralCode={referralCode}
          balanceReferralCode={balanceReferralCode}
          banks={banks || []}
          isFetching={loading}
        />
      </div>
    </>
  );
}
