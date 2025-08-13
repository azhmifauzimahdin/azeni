import { ReferralCodeService } from "@/lib/services";
import { useAdminReferralWithdrawalStore } from "@/stores/admin-referral-withdrawal-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useAdminReferralWithdrawal = () => {
  const user = useUserStore((state) => state.user);
  const withdrawals = useAdminReferralWithdrawalStore(
    (state) => state.withdrawals
  );
  const setReferralWithdrawal = useAdminReferralWithdrawalStore(
    (state) => state.setReferralWithdrawal
  );
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await ReferralCodeService.fetchReferralWithdrawalByUserId();
      setReferralWithdrawal(res.data);
    } catch (error) {
      console.error("Error fetching referral withdrawal code:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, setReferralWithdrawal]);

  useEffect(() => {
    if (user && withdrawals.length === 0) {
      fetchData();
    }
  }, [user, withdrawals.length, fetchData]);

  return {
    withdrawals,
    isFetching,
    refetch: fetchData,
  };
};

export default useAdminReferralWithdrawal;
