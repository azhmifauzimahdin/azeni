import { ReferralCodeLog } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const columns: ColumnDef<ReferralCodeLog>[] = [
  {
    accessorKey: "changedAt",
    header: "Tanggal Perubahan",
    cell: ({ row }) =>
      format(new Date(row.original.changedAt), "dd MMMM yyyy HH:mm", {
        locale: id,
      }),
  },
  {
    accessorKey: "oldDiscount",
    header: "Diskon Sebelumnya",
    cell: ({ row }) => row.original.oldDiscount ?? "-",
  },
  {
    accessorKey: "newDiscount",
    header: "Diskon Baru",
    cell: ({ row }) => row.original.newDiscount ?? "-",
  },
  {
    accessorKey: "oldIsPercent",
    header: "Sebelum Persen?",
    cell: ({ row }) => {
      const value = row.original.oldIsPercent;
      return value === null || value === undefined
        ? "-"
        : value
        ? "Ya"
        : "Tidak";
    },
  },
  {
    accessorKey: "newIsPercent",
    header: "Setelah Persen?",
    cell: ({ row }) => {
      const value = row.original.newIsPercent;
      return value === null || value === undefined
        ? "-"
        : value
        ? "Ya"
        : "Tidak";
    },
  },

  {
    accessorKey: "oldMaxDiscount",
    header: "Maks Diskon Lama",
    cell: ({ row }) => row.original.oldMaxDiscount ?? "-",
  },
  {
    accessorKey: "newMaxDiscount",
    header: "Maks Diskon Baru",
    cell: ({ row }) => row.original.newMaxDiscount ?? "-",
  },
  {
    accessorKey: "userName",
    header: "Diubah Oleh",
  },
];
