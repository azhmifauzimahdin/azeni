import { BankService } from "@/lib/services";
import useBankStore from "@/stores/bank-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useUserBanks = () => {
  const user = useUserStore((state) => state.user);
  const banks = useBankStore((state) => state.banks);
  const setBanks = useBankStore((state) => state.setBanks);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await BankService.fetchBanks();
      setBanks(res);
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

export default useUserBanks;
