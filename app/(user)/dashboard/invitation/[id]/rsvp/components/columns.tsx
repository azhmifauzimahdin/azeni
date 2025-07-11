import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Guest } from "@/types";

export const columns: ColumnDef<Guest>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    enableSorting: true,
  },
  {
    accessorKey: "totalGuests",
    header: "Orang",
    cell: ({ row }) => {
      const value = row.getValue("totalGuests") as number;
      const isAttending = row.getValue("isAttending") as boolean;

      return isAttending ? value : "-";
    },
    meta: {
      className: "w-[100px] text-center",
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const aGuests = rowA.getValue("totalGuests") as number;
      const bGuests = rowB.getValue("totalGuests") as number;

      const aAttending = rowA.getValue("isAttending") as boolean;
      const bAttending = rowB.getValue("isAttending") as boolean;

      const aValue = aAttending ? aGuests : -1;
      const bValue = bAttending ? bGuests : -1;

      return aValue - bValue;
    },
  },
  {
    accessorKey: "isAttending",
    header: "Status Kehadiran",
    cell: ({ row }) => {
      const attending = row.getValue("isAttending") as boolean;
      const totalGuests = row.getValue("totalGuests") as number;

      if (attending) {
        return <Badge variant="primary">Hadir</Badge>;
      }

      if (!attending && totalGuests === 0) {
        return <Badge variant="destructive">Tidak Hadir</Badge>;
      }

      return <Badge variant="secondary">Belum Konfirmasi</Badge>;
    },
    meta: {
      className: "text-center",
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const aAttending = rowA.getValue("isAttending") as boolean;
      const bAttending = rowB.getValue("isAttending") as boolean;

      const aGuests = (rowA.getValue("totalGuests") ?? 0) as number;
      const bGuests = (rowB.getValue("totalGuests") ?? 0) as number;

      const getStatusOrder = (attending: boolean, guests: number) => {
        if (attending) return 0;
        if (!attending && guests === 0) return 2;
        return 1;
      };

      const aOrder = getStatusOrder(aAttending, aGuests);
      const bOrder = getStatusOrder(bAttending, bGuests);

      return aOrder - bOrder;
    },
  },
];
