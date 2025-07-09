/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as z from "zod";
import * as XLSX from "xlsx";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, FileSpreadsheet, FilePlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { GuestService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import useInvitationStore from "@/stores/invitation-store";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";

const importFormSchema = z.object({
  file: z
    .instanceof(File, { message: "File wajib dipilih" })
    .refine(
      (file) =>
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      {
        message: "File harus berformat .xlsx",
      }
    ),
});

type ImportGuestBookFormValues = z.infer<typeof importFormSchema>;

interface ImportGuestBookFormsProps {
  params: {
    id: string;
  };
}

const ImportGuestBookForm: React.FC<ImportGuestBookFormsProps> = ({
  params,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[][]>([]);

  const addOrUpdateGuestToInvitation = useInvitationStore(
    (state) => state.addOrUpdateGuestToInvitation
  );

  const form = useForm<ImportGuestBookFormValues>({
    resolver: zodResolver(importFormSchema),
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        form.setValue("file", file);
        form.clearErrors("file");

        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });
          setPreviewData(jsonData);
        };
        reader.readAsArrayBuffer(file);
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
    maxSize: 2 * 1024 * 1024,
  });

  const onSubmit = async (data: ImportGuestBookFormValues) => {
    try {
      setLoading(true);
      const res = await GuestService.importGuest(params.id, data.file);
      res.data.forEach((guest) => {
        addOrUpdateGuestToInvitation(params.id, guest);
      });
      toast.success("Tamu berhasil diimport.");
      router.push(`/dashboard/invitation/${params.id}/guestbook`);
    } catch (error) {
      handleError(error, "import");
    } finally {
      setLoading(false);
    }
  };

  const guestPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalGuests = previewData.length > 1 ? previewData.length - 1 : 0;
  const totalPages = Math.ceil(totalGuests / guestPerPage);

  const currentGuest = previewData
    .slice(1)
    .slice((currentPage - 1) * guestPerPage, currentPage * guestPerPage);

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-white rounded-xl p-6 shadow-sm"
      >
        <p className="text-sm text-muted-foreground">
          Unggah file Excel yang berisi daftar tamu undangan.&nbsp;
          <Link
            href="https://res.cloudinary.com/dxtqjuvcg/raw/upload/v1751990526/Template-import-buku-tamu_jnlnbf.xlsx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-app-primary hover:underline"
          >
            Unduh template
          </Link>
          &nbsp; agar data dapat diproses dengan benar.
        </p>

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div
                  {...getRootProps()}
                  className={cn(
                    "mt-4 p-6 w-full border-2 border-dashed rounded-md cursor-pointer text-center transition-colors",
                    isDragActive
                      ? "border-green-500 bg-green-50"
                      : "hover:bg-gray-100"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    {field.value?.name ? (
                      <p className="flex items-center text-sm gap-2 text-foreground font-medium">
                        <FileSpreadsheet className="w-4 h-4" />
                        {field.value.name}
                      </p>
                    ) : (
                      <>
                        <FilePlus className="w-6 h-6 mb-2" />
                        <p className="text-sm font-medium">
                          Klik atau seret untuk mengunggah Excel
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Format .xlsx
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {previewData.length > 0 && (
          <>
            <div className="mt-6 overflow-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Grup</TableHead>
                    <TableHead>Alamat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentGuest.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell>
                        {(currentPage - 1) * guestPerPage + rowIndex + 1}
                      </TableCell>
                      <TableCell>{row[0]}</TableCell>
                      <TableCell>{row[1]}</TableCell>
                      <TableCell>{row[2]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex-center">
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  siblingCount={1}
                />
              </div>
            )}
            {previewData.length > 1 && (
              <div className="flex flex-col md:flex-row items-center justify-end gap-3">
                <Button
                  variant="primary"
                  isLoading={loading}
                  type="submit"
                  className="w-full md:w-auto"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
            )}
          </>
        )}
      </form>
    </Form>
  );
};

export default ImportGuestBookForm;
