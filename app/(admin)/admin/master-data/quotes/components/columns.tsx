import { ColumnDef } from "@tanstack/react-table";
import { QuoteTemplate } from "@/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const columns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}): ColumnDef<QuoteTemplate>[] => [
  {
    accessorKey: "name",
    header: "Quote",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "autho",
    header: "Author",
    cell: ({ row }) => row.original.author,
  },

  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const music = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(music.id)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(music.id, music.author)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];
