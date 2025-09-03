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
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import * as XLSX from "xlsx";

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

  const handleExport = () => {
    const transformedData =
      filteredData?.map((withdrawal, index) => ({
        No: index + 1,
        Kode: withdrawal.referralCode.code,
        "Nominal Penarikan": withdrawal.amount,
        Bank: withdrawal.bank.name,
        "Nomor Rekening": withdrawal.accountNumber,
        Nama: withdrawal.name,
        "Tanggal Permintaan": withdrawal.requestedAt
          ? format(new Date(withdrawal.requestedAt), "dd MMMM yyyy HH:mm", {
              locale: id,
            })
          : "-",
        "Tanggal Proses": withdrawal.processedAt
          ? format(new Date(withdrawal.processedAt), "dd MMMM yyyy HH:mm", {
              locale: id,
            })
          : "-",
        Status:
          withdrawal.status === "PENDING"
            ? "Menunggu Pembayaran"
            : withdrawal.status === "APPROVED"
            ? "Disetujui"
            : "Ditolak",
        "Bukti Transfer": withdrawal.transferProofUrl,
        Catatan: withdrawal.note,
      })) ?? [];

    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    const cols = Object.keys(transformedData[0] ?? {}).map((key) => {
      const maxLength = Math.max(
        key.length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...transformedData.map((row) => String((row as any)[key] || "").length)
      );
      return { wch: maxLength + 2 };
    });

    worksheet["!cols"] = cols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "Riwayat-Penarikan.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center sm:justify-end gap-2">
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex-1 md:flex-none"
          isFetching={isFetching}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
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
