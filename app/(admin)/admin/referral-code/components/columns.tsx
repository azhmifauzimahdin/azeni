import { ColumnDef } from "@tanstack/react-table";
import { ReferralCode } from "@/types";
import { Button } from "@/components/ui/button";
import { Eye, History, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link";

export const columns = ({
  onEdit,
}: {
  onEdit: (id: string) => void;
}): ColumnDef<ReferralCode>[] => [
  {
    accessorKey: "code",
    header: "Kode",
    cell: ({ row }) => row.original.code,
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
    accessorKey: "isPercent",
    header: "Persen",
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.isPercent ? "success" : "secondary"}>
          {row.original.isPercent ? "Ya" : "Tidak"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "maxDiscount",
    header: "Maksimal",
    cell: ({ row }) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.maxDiscount)),
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
    cell: ({ row }) => {
      const referralCode = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(referralCode.id)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <LinkButton
            href={`referral-code/${referralCode.code}`}
            variant="ghost"
            className="text-green-app-primary"
            size="icon"
          >
            <Eye className="w-4 h-4" />
          </LinkButton>
          <LinkButton
            href={`referral-code/log/${referralCode.code}`}
            variant="ghost"
            className="text-yellow-500"
            size="icon"
          >
            <History className="w-4 h-4" />
          </LinkButton>
        </div>
      );
    },
    enableSorting: false,
  },
];
