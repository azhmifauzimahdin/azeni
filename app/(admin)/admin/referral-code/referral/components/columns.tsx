import { ColumnDef } from "@tanstack/react-table";
import { ReferralCode } from "@/types";
import { Button } from "@/components/ui/button";
import { Eye, History, MoreVertical, Pencil, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import { Separator } from "@/components/ui/separator";

const ActionsCell = ({
  row,
  onEdit,
  onWithdrawal,
}: {
  row: Row<ReferralCode>;
  onEdit: (id: string) => void;
  onWithdrawal: (id: string) => void;
}) => {
  const router = useRouter();
  const { id, code, balance, withdrawals } = row.original;

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
        <Pencil className="w-4 h-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 text-center">
          <DropdownMenuItem
            onClick={() => router.push(`referral/${code}`)}
            className="flex items-center gap-2 py-2 cursor-pointer"
          >
            <Eye className="h-5 w-5" />
            <span className="text-xs">Transaksi</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`referral/log/${code}`)}
            className="flex items-center gap-2 py-2 cursor-pointer"
          >
            <History className="h-5 w-5" />
            <span className="text-xs">Riwayat Perubahan</span>
          </DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem
            onClick={() => onWithdrawal(id)}
            className="flex items-center gap-2 py-2 cursor-pointer"
            disabled={
              Number(balance?.availableBalance ?? 0) < 10000 ||
              withdrawals.some((w) => w.status === "PENDING")
            }
          >
            <Wallet className="h-5 w-5" />
            <span className="text-xs">Penarikan Dana</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`referral/withdrawal/${code}`)}
            className="flex items-center gap-2 py-2 cursor-pointer"
          >
            <History className="h-5 w-5" />
            <span className="text-xs">Riwayat Penarikan</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns = ({
  onEdit,
  onWithdrawal,
}: {
  onEdit: (id: string) => void;
  onWithdrawal: (id: string) => void;
}): ColumnDef<ReferralCode>[] => [
  {
    accessorKey: "userName",
    header: "User",
  },
  {
    accessorKey: "code",
    header: "Kode",
    cell: ({ row }) => row.original.code,
  },
  {
    accessorKey: "balance.totalReward",
    header: "Total Reward",
    cell: ({ row }) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original?.balance?.totalReward ?? 0)),
  },
  {
    accessorKey: "balance.availableBalance",
    header: "Sisa Saldo",
    cell: ({ row }) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original?.balance?.availableBalance ?? 0)),
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => row.original.description,
  },
  {
    accessorKey: "discount",
    header: "Diskon",
    cell: ({ row }) => {
      if (row.original.isPercent) return `${row.original.discount}%`;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.discount));
    },
  },
  {
    accessorKey: "maxDiscount",
    header: "Maksimal Diskon",
    cell: ({ row }) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.maxDiscount)),
  },
  {
    accessorKey: "referrerReward",
    header: "Reward",
    cell: ({ row }) => {
      if (row.original.referrerIsPercent)
        return `${row.original.referrerReward}%`;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.referrerReward));
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.isActive ? "success" : "secondary"}>
          {row.original.isActive ? "Aktif" : "Non Aktif"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <ActionsCell row={row} onEdit={onEdit} onWithdrawal={onWithdrawal} />
    ),

    enableSorting: false,
  },
];
