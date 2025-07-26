"use client";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { DataTableView } from "@/components/table/data-table-view";
import { ThemeCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  data: ThemeCategory[];
  columns: ColumnDef<ThemeCategory>[];
  onAddClick: () => void;
  isFetching?: boolean;
};

export function DataTable({ data, columns, onAddClick, isFetching }: Props) {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    return (data as ThemeCategory[]).filter((item) => {
      const matchName = item.name?.toLowerCase().includes(search.toLowerCase());
      return matchName;
    });
  }, [data, search]);

  const table = useReactTable<ThemeCategory>({
    data: filteredData,
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
          variant="primary"
          onClick={onAddClick}
          className="gap-2 order-1 sm:order-none self-stretch sm:self-auto"
          isFetching={isFetching}
        >
          <Plus className="w-4 h-4" />
          Tambah Data
        </Button>

        <Input
          id="search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama kategori..."
          className="w-full sm:max-w-xs order-2"
          autoComplete="off"
          isFetching={isFetching}
        />
      </div>

      <DataTableView table={table} isFetching={isFetching} />
    </div>
  );
}
