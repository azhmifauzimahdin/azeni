import { ColumnDef } from "@tanstack/react-table";
import { Invitation } from "@/types";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export const columns = ({
  onEdit,
}: {
  onEdit: (id: string) => void;
}): ColumnDef<Invitation>[] => [
  {
    accessorKey: "groom",
    header: "Pria",
  },
  {
    accessorKey: "bride",
    header: "Wanita",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "theme.name",
    header: "Tema",
  },
  {
    accessorKey: "expiresAt",
    header: "Kedaluwarsa",
  },

  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const invitation = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(invitation.id)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];
