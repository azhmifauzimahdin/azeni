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
import { Invitation } from "@/types";

type Props = {
  data: Invitation[];
  columns: ColumnDef<Invitation>[];
  isFetching?: boolean;
};

export function DataTable({ data, columns, isFetching }: Props) {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    return (data as Invitation[]).filter((item) => {
      const fullName = `${item.groom} ${item.bride}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [data, search]);

  const table = useReactTable<Invitation>({
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <Input
          id="seacrh"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama undangan..."
          className="w-full sm:max-w-xs"
          isFetching={isFetching}
          autoComplete="false"
        />
      </div>

      <DataTableView table={table} isFetching={isFetching} />
    </div>
  );
}
