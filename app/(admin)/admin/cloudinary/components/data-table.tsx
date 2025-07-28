"use client";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTableView } from "@/components/table/data-table-view";
import { CloudinaryUnusedResource } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  data: CloudinaryUnusedResource[];
  columns: ColumnDef<CloudinaryUnusedResource>[];
  onDeleteClick: () => void;
  isFetching?: boolean;
};

export function DataTable({ data, columns, onDeleteClick, isFetching }: Props) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable<CloudinaryUnusedResource>({
    data: data,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:flex sm:flex-row sm:items-center sm:justify-between gap-2">
        <Button
          variant="destructive"
          onClick={onDeleteClick}
          className="gap-2 order-1 sm:order-none self-stretch sm:self-auto"
          isFetching={isFetching}
        >
          <Trash2 className="w-4 h-4" />
          Hapus Gambar
        </Button>
      </div>

      <DataTableView table={table} isFetching={isFetching} />
    </div>
  );
}
