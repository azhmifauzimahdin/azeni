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
    header: "Diskon Lama",
    cell: ({ row }) => {
      if (row.original.oldIsPercent == null) return "-";
      if (row.original.oldIsPercent) return `${row.original.oldDiscount}%`;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.oldDiscount));
    },
  },
  {
    accessorKey: "newDiscount",
    header: "Diskon Baru",
    cell: ({ row }) => {
      if (row.original.newIsPercent == null) return "-";
      if (row.original.newIsPercent) return `${row.original.newDiscount}%`;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.newDiscount));
    },
  },
  {
    accessorKey: "oldMaxDiscount",
    header: "Maks Diskon Lama",
    cell: ({ row }) => {
      if (row.original.oldMaxDiscount == null) return "-";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.oldMaxDiscount));
    },
  },
  {
    accessorKey: "newMaxDiscount",
    header: "Maks Diskon Baru",
    cell: ({ row }) => {
      if (row.original.newMaxDiscount == null) return "-";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.newMaxDiscount));
    },
  },
  {
    accessorKey: "oldReferrerReward",
    header: "Reward Lama",
    cell: ({ row }) => {
      if (row.original.oldReferrerIsPercent == null) return "-";
      if (row.original.oldReferrerIsPercent)
        return `${row.original.oldReferrerReward}%`;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.oldReferrerReward));
    },
  },
  {
    accessorKey: "newReferrerReward",
    header: "Reward Baru",
    cell: ({ row }) => {
      if (row.original.newReferrerIsPercent == null) return "-";
      if (row.original.newReferrerIsPercent)
        return `${row.original.newReferrerReward}%`;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.newReferrerReward));
    },
  },

  {
    accessorKey: "userName",
    header: "Diubah Oleh",
  },
];
