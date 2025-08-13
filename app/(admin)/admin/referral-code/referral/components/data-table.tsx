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
import { ReferralCode } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  data: ReferralCode[];
  columns: ColumnDef<ReferralCode>[];
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
  const [attendanceFilter, setAttendanceFilter] = useState("ALL");

  const filteredData = useMemo(() => {
    return (data as ReferralCode[]).filter((item) => {
      const matchName = item.code?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        attendanceFilter === "ALL" ||
        String(item.isActive) === attendanceFilter.toLowerCase();

      return matchName && matchesStatus;
    });
  }, [attendanceFilter, data, search]);

  const table = useReactTable<ReferralCode>({
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
        <Button
          variant="primary"
          onClick={onAddClick}
          className="gap-2 order-0 sm:order-none w-full sm:w-auto"
          isFetching={isFetching}
        >
          <Plus className="w-4 h-4" />
          Tambah Data
        </Button>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 order-1 sm:order-none w-full sm:w-auto">
          <Input
            id="search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode referral..."
            className="sm:w-[200px]"
            autoComplete="off"
            isFetching={isFetching}
          />

          <Select value={attendanceFilter} onValueChange={setAttendanceFilter}>
            <SelectTrigger
              className="sm:w-[160px]"
              isFetching={isFetching}
              id="filter"
            >
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua</SelectItem>
              <SelectItem value="TRUE">Aktif</SelectItem>
              <SelectItem value="FALSE">Non Aktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTableView table={table} isFetching={isFetching} />
    </div>
  );
}
