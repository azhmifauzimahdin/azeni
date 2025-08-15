import { ColumnDef } from "@tanstack/react-table";
import { Theme } from "@/types";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/ui/button";
import { Mail, Pencil } from "lucide-react";
import { LinkButton } from "@/components/ui/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const columns = ({
  onEdit,
}: {
  onEdit: (id: string) => void;
}): ColumnDef<Theme>[] => [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    enableSorting: false,
    cell: ({ row }) => (
      <Img
        src={row.original.thumbnail}
        alt="Thumbnail"
        wrapperClassName="aspect-square h-20"
        className="h-full object-contain"
        sizes="300px"
      />
    ),
  },
  {
    accessorKey: "colorTag",
    header: "Warna",
    cell: ({ row }) => row.original.colorTag,
  },
  {
    accessorKey: "category.name",
    header: "Kategori",
    cell: ({ row }) => row.original.category.name,
  },
  {
    accessorKey: "originalPrice",
    header: "Harga",
    cell: ({ row }) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.originalPrice)),
  },
  {
    accessorKey: "discount",
    header: "Diskon",
    cell: ({ row }) => {
      if (row.original.isPercent) return `${row.original.discount}%`;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.discount));
    },
  },
  {
    accessorKey: "src",
    header: "Musik",
    cell: ({ row }) => row.original.invitation?.music?.name,
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "invitation.groom",
    header: "Pria",
    cell: ({ row }) => row.original.invitation?.groom,
  },
  {
    accessorKey: "invitation.bride",
    header: "Wanita",
    cell: ({ row }) => row.original.invitation?.bride,
  },
  {
    accessorKey: "invitation.slug",
    header: "Slug",
    cell: ({ row }) => row.original.invitation?.slug,
  },
  {
    accessorKey: "invitation.image",
    header: "Gambar",
    enableSorting: false,
    cell: ({ row }) => {
      if (!row.original.invitation?.image) return null;
      return (
        <Img
          src={row.original.invitation?.image}
          alt="Image invitation"
          wrapperClassName="aspect-square h-20"
          className="h-full object-contain"
          sizes="300px"
        />
      );
    },
  },

  {
    accessorKey: "invitation.date",
    header: "Tanggal",
    cell: ({ row }) => {
      if (!row.original.invitation?.date) return null;
      return format(
        new Date(row.original.invitation?.date),
        "dd MMMM yyyy HH:mm",
        { locale: id }
      );
    },
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "invitation.expiresAt",
    header: "Tanggal",
    cell: ({ row }) => {
      if (!row.original.invitation?.expiresAt) return null;
      return format(
        new Date(row.original.invitation?.expiresAt),
        "dd MMMM yyyy HH:mm",
        { locale: id }
      );
    },
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const theme = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(theme.id)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <LinkButton
            href={`themes/${theme.invitation?.id}`}
            variant="ghost"
            className="text-green-app-primary"
            size="icon"
          >
            <Mail className="w-4 h-4" />
          </LinkButton>
        </div>
      );
    },
    enableSorting: false,
  },
];
