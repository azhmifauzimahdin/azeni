import { ColumnDef } from "@tanstack/react-table";
import { CloudinaryUnusedResource } from "@/types";

export const columns: ColumnDef<CloudinaryUnusedResource>[] = [
  {
    accessorKey: "public_id",
    header: "Public ID",
  },
  {
    accessorKey: "secure_url",
    header: "Secure URL",
  },
];
