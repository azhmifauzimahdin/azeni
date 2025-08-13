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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { DataTableView } from "@/components/table/data-table-view";
import { Transaction } from "@/types";

type Props = {
  data: Transaction[];
  columns: ColumnDef<Transaction>[];
  isFetching?: boolean;
};

export function DataTable({ data, columns, isFetching }: Props) {
  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("ALL");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    return (data as Transaction[]).filter((item) => {
      const fullName = `${item.groomName} ${item.brideName}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase());

      const matchesStatus =
        attendanceFilter === "ALL" || item.status.name === attendanceFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, attendanceFilter]);

  const table = useReactTable<Transaction>({
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
          placeholder="Cari nama undangan..."
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
            <SelectValue placeholder="Filter kehadiran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua</SelectItem>
            <SelectItem value="PENDING">Menunggu Pembayaran</SelectItem>
            <SelectItem value="SUCCESS">Lunas</SelectItem>
            <SelectItem value="FAILED">Gagal</SelectItem>
            <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTableView table={table} isFetching={isFetching} />
    </div>
  );
}
