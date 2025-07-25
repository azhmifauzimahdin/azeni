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
import { Music } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  data: Music[];
  columns: ColumnDef<Music>[];
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
    return (data as Music[]).filter((item) => {
      const matchName = item.name?.toLowerCase().includes(search.toLowerCase());
      return matchName;
    });
  }, [data, search]);

  const table = useReactTable<Music>({
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama musik..."
          className="w-full sm:max-w-xs order-2"
          autoComplete="off"
          isFetching={isFetching}
        />
      </div>

      <DataTableView table={table} isFetching={isFetching} />
    </div>
  );
}
