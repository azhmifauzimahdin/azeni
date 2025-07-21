import { ColumnDef } from "@tanstack/react-table";
import { Wallet } from "lucide-react";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { StatusBadge } from "../../invitation/components/invitation-card";
import { LinkButton } from "@/components/ui/link";

type InternalStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

const statusCodeMap: Record<InternalStatus, 200 | 201 | 202> = {
  SUCCESS: 200,
  REFUNDED: 200,
  CANCELLED: 200,
  PENDING: 201,
  FAILED: 202,
};

function mapStatusNameToStatusCode(status: InternalStatus): 200 | 201 | 202 {
  return statusCodeMap[status];
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "invitationSlug",
    header: "Link",
    cell: ({ row }) => row.original.invitationSlug,
  },
  {
    header: "Undangan",
    cell: ({ row }) => {
      const { groomName, brideName } = row.original;
      return `${groomName} & ${brideName}`;
    },
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
    cell: ({ row }) => format(new Date(row.original.date), "dd MMM yyyy HH:mm"),
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
    id: "aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const orderId = row.original.orderId;
      const status = row.original.status.name;

      return (
        <LinkButton
          href={`/invitation/payment?order_id=${orderId}&status_code=${mapStatusNameToStatusCode(
            status
          )}&transaction_status=${status.toLowerCase()}`}
          variant="primary"
          size="sm"
        >
          <Wallet />
          Detail Pembayaran
        </LinkButton>
      );
    },
  },
];
