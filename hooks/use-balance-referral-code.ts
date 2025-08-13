import { ReferralCodeService } from "@/lib/services";
import { useBalanceReferralCodeStore } from "@/stores/balance-referral-code-store ";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useBalanceReferralCode = () => {
  const user = useUserStore((state) => state.user);
  const balanceReferralCode = useBalanceReferralCodeStore(
    (state) => state.balanceReferralCode
  );
  const setBalanceReferralCode = useBalanceReferralCodeStore(
    (state) => state.setBalanceReferralCode
  );
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await ReferralCodeService.fetchBalanceReferralCodeByUserId();
      setBalanceReferralCode(res.data);
    } catch (error) {
      console.error("Error fetching balance referral code:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, setBalanceReferralCode]);

  useEffect(() => {
    if (user && !balanceReferralCode) {
      fetchData();
    }
  }, [user, balanceReferralCode, fetchData]);

  return { balanceReferralCode, isFetching, refetch: fetchData };
};

export default useBalanceReferralCode;
