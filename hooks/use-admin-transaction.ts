import { TransactionService } from "@/lib/services";
import useAdminTransactionStore from "@/stores/admin-transaction-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useAdminTransactions = () => {
  const user = useUserStore((state) => state.user);
  const transactions = useAdminTransactionStore((state) => state.transactions);
  const setTransactions = useAdminTransactionStore(
    (state) => state.setTransactions
  );
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await TransactionService.fetchTransactions();
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, setTransactions]);

  useEffect(() => {
    if (user && transactions.length === 0) {
      fetchData();
    }
  }, [user, transactions.length, fetchData]);

  return { transactions, isFetching, refetch: fetchData };
};

export default useAdminTransactions;
