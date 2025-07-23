import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { StatusBadge } from "../../invitation/components/invitation-card";

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
  // {
  //   id: "aksi",
  //   header: "Aksi",
  //   cell: ({ row }) => {
  //     const orderId = row.original.orderId;
  //     const invitationId = row.original.invitationId;
  //     const status = row.original.status.name;

  //     return (
  //       <>
  //         <LinkButton
  //           href={`/dashboard/invitation/new/${invitationId}/payment?order_id=${orderId}&status_code=${mapStatusNameToStatusCode(
  //             status
  //           )}&transaction_status=${status.toLowerCase()}`}
  //           variant="primary"
  //           size="sm"
  //         >
  //           <Wallet />
  //           Detail Pembayaran
  //         </LinkButton>
  //       </>
  //     );
  //   },
  // },
];
