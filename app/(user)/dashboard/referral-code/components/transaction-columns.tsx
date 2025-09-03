import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorFn: (row) => `${row.groomName} & ${row.brideName}`,
    header: "Undangan",
    cell: ({ row }) => {
      const { groomName, brideName } = row.original;
      return `${groomName} & ${brideName}`;
    },
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "referralCode.code",
    header: "Referral",
    cell: ({ row }) => row.original.referralCode?.code || "-",
  },
  {
    accessorKey: "referrerRewardAmount",
    header: "Nominal Reward",
    cell: ({ row }) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.referrerRewardAmount));
    },
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) =>
      format(new Date(row.original.date), "dd MMMM yyyy HH:mm", { locale: id }),
    meta: {
      className: "whitespace-nowrap",
    },
  },
];
