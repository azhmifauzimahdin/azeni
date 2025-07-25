"use client";

import { flexRender, Table as TanstackTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getJustifyClass } from "@/lib/utils/classnames";

export type DataTableViewProps<T> = {
  table: TanstackTable<T>;
  pageSizes?: number[];
  isFetching?: boolean;
};

export function DataTableView<T>({
  table,
  pageSizes = [5, 10, 20, 50, 100],
  isFetching,
}: DataTableViewProps<T>) {
  const pagination = table.getState().pagination;
  const headers = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const columnsLength = headers[0]?.headers.length || 0;

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {headers.map((group) => (
              <TableRow key={group.id}>
                <TableHead className="w-[50px] text-center">No</TableHead>
                {group.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={cn(
                        header.column.columnDef.meta?.className,
                        canSort && "cursor-pointer select-none"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          getJustifyClass(
                            header.column.columnDef.meta?.className
                          )
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {canSort && (
                          <div>
                            <ChevronUp
                              strokeWidth={3}
                              className={cn(
                                "w-3 h-3",
                                isSorted === "asc"
                                  ? "opacity-100 text-green-app-primary"
                                  : "opacity-50"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isSorted === "asc") {
                                  header.column.clearSorting();
                                } else {
                                  header.column.toggleSorting(false);
                                }
                              }}
                            />

                            <ChevronDown
                              strokeWidth={3}
                              className={cn(
                                "w-3 h-3 -mt-1",
                                isSorted === "desc"
                                  ? "opacity-100 text-green-app-primary"
                                  : "opacity-50"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isSorted === "desc") {
                                  header.column.clearSorting();
                                } else {
                                  header.column.toggleSorting(true);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isFetching ? (
              [...Array(10)].map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="w-[50px] text-center">
                    <div className="h-4 w-6 mx-auto bg-gray-200 rounded animate-pulse" />
                  </TableCell>

                  {headers[0]?.headers.map((header, i) => (
                    <TableCell
                      key={`${idx}-${i}`}
                      className={header.column.columnDef.meta?.className}
                    >
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length ? (
              rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell className="w-[50px] text-center">
                    {index + 1 + pagination.pageIndex * pagination.pageSize}
                  </TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnsLength + 1} className="text-center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tampilkan</span>
          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger
              id="page-size"
              className="w-20 h-8"
              isFetching={isFetching}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">/ halaman</span>
        </div>

        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
          <Pagination
            currentPage={pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
            onPageChange={(page) => table.setPageIndex(page - 1)}
          />
        </div>
      </div>
    </>
  );
}
