import { ColumnDef } from "@tanstack/react-table";
import { ReferralWithdrawal } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export const approvalColumns = ({
  onApprove,
  onReject,
}: {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
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
    accessorKey: "requestedAt",
    header: "Tanggal Permintaan",
    cell: ({ row }) =>
      format(new Date(row.original.requestedAt), "dd MMMM yyyy HH:mm", {
        locale: id,
      }),
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-green-app-primary"
            onClick={() => onApprove(id)}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onReject(id)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];
