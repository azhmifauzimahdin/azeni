import { ColumnDef } from "@tanstack/react-table";
import { Bank } from "@/types";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const columns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}): ColumnDef<Bank>[] => [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "icon",
    header: "Logo",
    enableSorting: false,
    cell: ({ row }) => (
      <Img
        src={row.original.icon}
        alt="Logo Bank"
        wrapperClassName="aspect-[3/1] h-3"
        className="h-full object-contain"
        sizes="15px"
      />
    ),
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(bank.id, bank.name)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];
