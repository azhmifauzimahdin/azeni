import { TransactionService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import useTransactionStore from "@/stores/transaction-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useUserTransactions = () => {
  const user = useUserStore((state) => state.user);
  const transactions = useTransactionStore((state) => state.transactions);
  const setTransactions = useTransactionStore((state) => state.setTransactions);
  const [isFetching, setIsFetching] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await TransactionService.fetchTransactionByUserId(user.id);
      setTransactions(res.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  }, [user, setTransactions]);

  const getTransactionById = useCallback(
    (id: string) => {
      return transactions.find((transaction) => transaction.id === id);
    },
    [transactions]
  );

  const getTransactionByOrderId = useCallback(
    (orderId: string) => {
      return transactions.find(
        (transaction) => transaction.orderId === orderId
      );
    },
    [transactions]
  );

  useEffect(() => {
    if (user && transactions.length === 0) {
      fetchData();
    } else {
      setIsFetching(false);
    }
  }, [user, transactions.length, fetchData]);

  return {
    transactions,
    isFetching,
    refetch: fetchData,
    getTransactionById,
    getTransactionByOrderId,
  };
};

export default useUserTransactions;
