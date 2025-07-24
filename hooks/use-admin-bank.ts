import { BankService } from "@/lib/services";
import useAdminBankStore from "@/stores/admin-bank-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useAdminBanks = () => {
  const user = useUserStore((state) => state.user);
  const banks = useAdminBankStore((state) => state.banks);
  const setBanks = useAdminBankStore((state) => state.setBanks);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await BankService.fetchBanks();
      setBanks(res.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, setBanks]);

  useEffect(() => {
    if (user && banks.length === 0) {
      fetchData();
    }
  }, [user, banks.length, fetchData]);

  return { banks, isFetching, refetch: fetchData };
};

export default useAdminBanks;
