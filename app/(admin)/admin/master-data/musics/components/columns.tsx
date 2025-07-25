import { ColumnDef } from "@tanstack/react-table";
import { Music } from "@/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import MusicPlayer from "@/components/ui/music-player";
import { Badge } from "@/components/ui/badge";

export const columns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}): ColumnDef<Music>[] => [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "origin",
    header: "Origin",
    cell: ({ row }) => {
      const origin = row.original.origin;
      return (
        <Link
          href={origin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-app-primary underline hover:text-green-app-secondary"
        >
          {origin}
        </Link>
      );
    },
  },
  {
    accessorKey: "src",
    header: "Preview",
    cell: ({ row }) => {
      const src = row.original.src;
      const id = row.original.id;

      if (!src)
        return <span className="text-muted-foreground italic">Tidak ada</span>;

      return (
        <div className="w-[200px]">
          <MusicPlayer src={src} id={id} />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "visibility",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.visibility ? "success" : "secondary"}>
          {row.original.visibility ? "Publik" : "Privat"}
        </Badge>
      );
    },
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
            onClick={() => onDelete(music.id, music.name)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];
