import { ReferralCodeService } from "@/lib/services";
import useAdminReferralCodeStore from "@/stores/admin-referral-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useAdminReferralCode = () => {
  const user = useUserStore((state) => state.user);
  const referralCodes = useAdminReferralCodeStore(
    (state) => state.referralCodes
  );
  const setReferralCodes = useAdminReferralCodeStore(
    (state) => state.setReferralCodes
  );
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await ReferralCodeService.fetchReferralCodes();
      setReferralCodes(res.data);
    } catch (error) {
      console.error("Error fetching referral code:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, setReferralCodes]);

  useEffect(() => {
    if (user && referralCodes.length === 0) {
      fetchData();
    }
  }, [user, referralCodes.length, fetchData]);

  const getReferralCodeByCode = (code: string) => {
    return referralCodes.find((ref) => ref.code === code);
  };

  return {
    referralCodes,
    isFetching,
    refetch: fetchData,
    getReferralCodeByCode,
  };
};

export default useAdminReferralCode;
