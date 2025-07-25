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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [attendanceFilter, setAttendanceFilter] = useState("ALL");

  const filteredData = useMemo(() => {
    return (data as Music[]).filter((item) => {
      const matchName = item.name?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        attendanceFilter === "ALL" ||
        String(item.visibility) === attendanceFilter.toLowerCase();

      return matchName && matchesStatus;
    });
  }, [attendanceFilter, data, search]);

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama musik..."
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
              <SelectValue placeholder="Filter kehadiran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua</SelectItem>
              <SelectItem value="TRUE">Publik</SelectItem>
              <SelectItem value="FALSE">Privat</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTableView table={table} isFetching={isFetching} />
    </div>
  );
}
