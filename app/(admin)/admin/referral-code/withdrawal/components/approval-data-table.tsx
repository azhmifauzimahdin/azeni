"use client";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTableView } from "@/components/table/data-table-view";
import { ReferralWithdrawal } from "@/types";
import { Input } from "@/components/ui/input";

type Props = {
  data: ReferralWithdrawal[];
  columns: ColumnDef<ReferralWithdrawal>[];
  isFetching?: boolean;
};

export function ApprovalDataTable({ data, columns, isFetching }: Props) {
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    return (data as ReferralWithdrawal[]).filter((item) => {
      const matchesSearch = item.name.includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [data, search]);

  const table = useReactTable<ReferralWithdrawal>({
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
      <div className="flex flex-row sm:items-center sm:justify-between gap-2">
        <Input
          id="seacrh"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari atas nama..."
          className="w-full sm:max-w-xs"
          isFetching={isFetching}
          autoComplete="false"
        />
      </div>

      <DataTableView table={table} isFetching={isFetching} />
    </div>
  );
}
