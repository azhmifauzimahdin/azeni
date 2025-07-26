import { ColumnDef } from "@tanstack/react-table";
import { ThemeCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export const columns = ({
  onEdit,
}: {
  onEdit: (id: string) => void;
}): ColumnDef<ThemeCategory>[] => [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => row.original.name,
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const bank = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(bank.id)}>
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];
