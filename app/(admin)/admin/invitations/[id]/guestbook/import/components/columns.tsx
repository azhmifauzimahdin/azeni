import { ColumnDef } from "@tanstack/react-table";

export type Guest = {
  Nama?: string;
  Grup?: string;
  Alamat?: string;
};

export const columns: ColumnDef<Guest>[] = [
  {
    accessorKey: "Nama",
    header: "Nama",
    enableSorting: true,
  },
  {
    accessorKey: "Grup",
    header: "Grup",
    enableSorting: true,
  },
  {
    accessorKey: "Alamat",
    header: "Alamat",
    enableSorting: true,
  },
];
