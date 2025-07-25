"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import TransactionsForm from "./transactions-form";
import useAdminTransactions from "@/hooks/use-admin-transaction";

const TransactionsContent: React.FC = () => {
  const { transactions, isFetching } = useAdminTransactions();

  return (
    <>
      <div>
        <Heading title="Transaksi" />
      </div>
      <div>
        <TransactionsForm initialData={transactions} isFetching={isFetching} />
      </div>
    </>
  );
};

export default TransactionsContent;
