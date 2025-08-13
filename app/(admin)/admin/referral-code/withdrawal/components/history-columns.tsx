import { ColumnDef } from "@tanstack/react-table";
import { ReferralWithdrawal } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import WithdrawalStatusBadge from "@/components/ui/withdrawal-status-badge";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export const historyColumns = ({
  onProofClick,
}: {
  onProofClick: (id: string) => void;
}): ColumnDef<ReferralWithdrawal>[] => [
  {
    accessorKey: "referralCode.userName",
    header: "User",
  },
  {
    accessorKey: "referralCode.code",
    header: "Kode",
  },
  {
    accessorKey: "amount",
    header: "Nominal Penarikan",
    cell: ({ row }) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.amount));
    },
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "bank.name",
    header: "Bank",
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "accountNumber",
    header: "Nomor Rekening",
  },
  {
    accessorKey: "name",
    header: "Atas Nama",
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "processedAt",
    header: "Tanggal Proses",
    cell: ({ row }) => {
      const processedAt = row.original.processedAt;
      if (!processedAt) return "-";

      return format(new Date(processedAt), "dd MMMM yyyy HH:mm", {
        locale: id,
      });
    },
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "status.name",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return <WithdrawalStatusBadge status={status} />;
    },
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "transferProofUrl",
    header: "Bukti Pembayaran",
    cell: ({ row }) => {
      const { id, status, transferProofUrl } = row.original;
      if (status !== "APPROVED" || !transferProofUrl) return "-";
      return (
        <Button
          variant="primary"
          className="rounded-full"
          size="sm"
          onClick={() => onProofClick(id)}
        >
          <Wallet size={12} /> Bukti Transfer
        </Button>
      );
    },
  },
  {
    accessorKey: "note",
    header: "Catatan",
  },
];
