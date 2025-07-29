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
import { Guest } from "@/types";
import { DataTableView } from "@/components/table/data-table-view";

type Props = {
  data: Guest[];
  columns: ColumnDef<Guest>[];
  isFecthing?: boolean;
};

export function DataTable({ data, columns, isFecthing }: Props) {
  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    return (data as Guest[]).filter((item) => {
      const matchName = item.name?.toLowerCase().includes(search.toLowerCase());
      const matchAttendance =
        attendanceFilter === "all"
          ? true
          : attendanceFilter === "hadir"
          ? item.isAttending === true
          : attendanceFilter === "tidak"
          ? item.isAttending === false && item.totalGuests === 0
          : attendanceFilter === "belum"
          ? item.isAttending === false && (item.totalGuests ?? 0) > 0
          : true;

      return matchName && matchAttendance;
    });
  }, [data, search, attendanceFilter]);

  const table = useReactTable<Guest>({
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
          placeholder="Cari nama tamu..."
          className="w-full sm:max-w-xs"
          isFetching={isFecthing}
          autoComplete="false"
        />

        <Select value={attendanceFilter} onValueChange={setAttendanceFilter}>
          <SelectTrigger
            className="w-full sm:w-[200px]"
            isFetching={isFecthing}
            id="filter"
          >
            <SelectValue placeholder="Filter kehadiran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="hadir">Hadir</SelectItem>
            <SelectItem value="belum">Belum Konfirmasi</SelectItem>
            <SelectItem value="tidak">Tidak Hadir</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTableView table={table} isFetching={isFecthing} />
    </div>
  );
}
