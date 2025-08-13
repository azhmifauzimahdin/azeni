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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  data: ReferralWithdrawal[];
  columns: ColumnDef<ReferralWithdrawal>[];
  isFetching?: boolean;
};

export function HistoryDataTable({ data, columns, isFetching }: Props) {
  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("ALL");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    return (data as ReferralWithdrawal[]).filter((item) => {
      const matchesSearch = item.name.includes(search.toLowerCase());

      const matchesStatus =
        attendanceFilter === "ALL" || item.status === attendanceFilter;

      return matchesSearch && matchesStatus;
    });
  }, [attendanceFilter, data, search]);

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

        <Select value={attendanceFilter} onValueChange={setAttendanceFilter}>
          <SelectTrigger
            className="w-full sm:w-[200px]"
            isFetching={isFetching}
            id="filter"
          >
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua</SelectItem>
            <SelectItem value="APPROVED">Disetujui</SelectItem>
            <SelectItem value="REJECTED">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTableView table={table} isFetching={isFetching} />
    </div>
  );
}
