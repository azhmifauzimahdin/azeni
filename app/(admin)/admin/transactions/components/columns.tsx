import { ColumnDef, Row } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { StatusBadge } from "@/app/(user)/dashboard/invitation/components/invitation-card";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "invitationSlug",
    header: "Slug",
    cell: ({ row }) => row.original.invitationSlug,
    meta: {
      className: "whitespace-nowrap",
    },
  },
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
    accessorKey: "originalAmount",
    header: "Tema",
    cell: ({ row }) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.originalAmount)),
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "discountAmount",
    header: "Diskon Tema",
    cell: ({ row }: { row: Row<Transaction> }) => {
      const originalAmount = Number(row.original.originalAmount) || 0;
      const referralDiscount = Number(row.original.referralDiscountAmount) || 0;
      const amount = Number(row.original.amount) || 0;

      const diskon = originalAmount - referralDiscount - amount;

      return (
        `- ` +
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(diskon)
      );
    },
    sortingFn: (a: Row<Transaction>, b: Row<Transaction>) => {
      const getDiskon = (row: Row<Transaction>) =>
        Number(row.original.originalAmount || 0) -
        Number(row.original.referralDiscountAmount || 0) -
        Number(row.original.amount || 0);

      return getDiskon(a) - getDiskon(b);
    },
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "referralDiscountAmount",
    header: "Diskon Referral",
    cell: ({ row }) => {
      return (
        `- ` +
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(Number(row.original.referralDiscountAmount))
      );
    },
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "amount",
    header: "Total",
    cell: ({ row }) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.amount)),
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
  {
    accessorKey: "status.name",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.name;
      return <StatusBadge statusName={status} />;
    },
    meta: {
      className: "whitespace-nowrap",
    },
  },
];
