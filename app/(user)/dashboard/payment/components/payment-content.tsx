"use client";

import { Heading } from "@/components/ui/heading";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import useUserTransactions from "@/hooks/use-user-transaction";
import useUserInvitations from "@/hooks/use-user-invitation";

export default function PaymentContent() {
  const { transactions, isFetching } = useUserTransactions();
  useUserInvitations();

  return (
    <>
      <div>
        <Heading
          title="Transaksi"
          description="Riwayat transaksi dan status pembayaran terbaru dapat dilihat di sini"
        />
      </div>
      <div className="card-dashboard">
        <DataTable
          columns={columns}
          data={transactions || []}
          isFecthing={isFetching}
        />
      </div>
    </>
  );
}
