import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { StatusBadge } from "../../invitation/components/invitation-card";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TransactionReceipt } from "@/components/ui/transaction-receipt";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "invitationSlug",
    header: "Link",
    cell: ({ row }) => row.original.invitationSlug,
  },
  {
    accessorFn: (row) => `${row.groomName} & ${row.brideName}`,
    header: "Undangan",
    cell: ({ row }) => {
      const { groomName, brideName } = row.original;
      return `${groomName} & ${brideName}`;
    },
  },
  {
    accessorKey: "referralCode.code",
    header: "Referral",
    cell: ({ row }) => row.original.referralCode?.code || "-",
  },
  {
    accessorKey: "amount",
    header: "Jumlah",
    cell: ({ row }) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.amount)),
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) =>
      format(new Date(row.original.date), "dd MMMM yyyy HH:mm", { locale: id }),
  },
  {
    accessorKey: "status.name",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.name;
      return <StatusBadge statusName={status} />;
    },
  },
  {
    header: "Aksi",
    enableSorting: false,
    cell: ({ row }) => {
      if (row.original.status.name !== "SUCCESS") return null;
      return (
        <PDFDownloadLink
          document={
            <TransactionReceipt
              data={row.original}
              logoUrl="/assets/img/azen-green-a.png"
              signatureUrl={undefined}
            />
          }
          fileName={`${row.original.orderId}.pdf`}
        >
          {({ loading }) => (
            <Button
              disabled={loading}
              variant="primary"
              className="rounded-full"
              size="sm"
            >
              <Wallet /> Bukti Pembayaran
            </Button>
          )}
        </PDFDownloadLink>
      );
    },
  },
];
