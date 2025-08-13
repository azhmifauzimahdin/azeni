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

export function DataTable({ data, columns, isFetching }: Props) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [attendanceFilter, setAttendanceFilter] = useState("ALL");

  const filteredData = useMemo(() => {
    return (data as ReferralWithdrawal[]).filter((item) => {
      const matchesStatus =
        attendanceFilter === "ALL" || item.status === attendanceFilter;

      return matchesStatus;
    });
  }, [attendanceFilter, data]);

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
      <div className="flex flex-row items-center sm:justify-end gap-2">
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
            <SelectItem value="PENDING">Menunggu Persetujuan</SelectItem>
            <SelectItem value="APPROVED">Disetujui</SelectItem>
            <SelectItem value="REJECTED">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTableView table={table} isFetching={isFetching} />
    </div>
  );
}
