import { ReferralCodeService } from "@/lib/services";
import { useReferralCodeStore } from "@/stores/referral-code-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useReferralCode = () => {
  const user = useUserStore((state) => state.user);
  const referralCode = useReferralCodeStore((state) => state.referralCode);
  const setReferralCode = useReferralCodeStore(
    (state) => state.setReferralCode
  );
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await ReferralCodeService.fetchReferralCodeByUserId();
      setReferralCode(res.data);
    } catch (error) {
      console.error("Error fetching referral code:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, setReferralCode]);

  useEffect(() => {
    if (user && !referralCode) {
      fetchData();
    }
  }, [user, referralCode, fetchData]);

  return { referralCode, isFetching, refetch: fetchData };
};

export default useReferralCode;
