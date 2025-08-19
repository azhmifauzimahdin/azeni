"use client";

import { Guest, Invitation } from "@/types";
import { Copy, Download, Pencil, Plus, Save, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createGuestSchema } from "@/lib/schemas/guest";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import { GuestService } from "@/lib/services";
import toast from "react-hot-toast";
import { handleError } from "@/lib/utils/handle-error";
import { Textarea } from "@/components/ui/textarea";
import Image from "@/components/ui/image";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";
import GuestBookCard, { GuestBookCardSkeleton } from "./guestbook-card";
import { defaultWhatsappMessageTemplate } from "@/lib/utils/default";
import { renderTemplate } from "@/lib/utils/render-template";
import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import useAdminInvitationStore from "@/stores/admin-invitation-store";
import { IoLogoWhatsapp } from "react-icons/io5";

type GuestBookFormValues = z.infer<typeof createGuestSchema>;

interface StoryFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const GuestBookForm: React.FC<StoryFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const router = useRouter();

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalShareLinkOpen, setIsModalShareLinkOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingWhastapp, setLoadingWhastapp] = useState(false);
  const [loadingCheckInId, setLoadingCheckInId] = useState<string | null>(null);
  const [loadingCheckOutId, setLoadingCheckOutId] = useState<string | null>(
    null
  );
  const [readyToOpenWhatsapp, setReadyToOpenWhatsapp] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [updatingGuestId, setUpdatingGuestId] = useState<string | null>(null);
  const [deletingGuestId, setDeletingGuestId] = useState<string | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [sortBy, setSortBy] = useState("created-desc");

  const [searchTerm, setSearchTerm] = useState("");
  const [deletingGuestName, setDeletingGuestName] = useState<string | null>(
    null
  );

  const addOrUpdateGuestToInvitation = useAdminInvitationStore(
    (state) => state.addOrUpdateGuestToInvitation
  );
  const deleteGuestFromInvitation = useAdminInvitationStore(
    (state) => state.deleteGuestFromInvitation
  );

  const checkInGuestInInvitation = useAdminInvitationStore(
    (state) => state.checkInGuestInInvitation
  );
  const checkOutGuestInInvitation = useAdminInvitationStore(
    (state) => state.checkOutGuestInInvitation
  );

  const form = useForm<GuestBookFormValues>({
    resolver: zodResolver(createGuestSchema),
    defaultValues: {
      name: "",
      group: "",
      address: "",
    },
  });

  const onSubmit = async (data: GuestBookFormValues) => {
    try {
      setLoading(true);
      let res;
      if (updatingGuestId)
        res = await GuestService.updateGuest(params.id, updatingGuestId, data);
      else res = await GuestService.createGuest(params.id, data);
      addOrUpdateGuestToInvitation(params.id, res.data);
      toast.success("Tamu berhasil disimpan.");
      setIsModalAddOpen(false);
      form.reset({
        name: "",
        group: "",
        address: "",
      });
      setUpdatingGuestId(null);
    } catch (error: unknown) {
      handleError(error, "guest");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitWhatsApp = async (data: GuestBookFormValues) => {
    try {
      setLoadingWhastapp(true);

      let res;
      if (updatingGuestId)
        res = await GuestService.updateGuest(params.id, updatingGuestId, data);
      else res = await GuestService.createGuest(params.id, data);

      addOrUpdateGuestToInvitation(params.id, res.data);

      toast.success("Tamu berhasil disimpan.");
      setIsModalAddOpen(false);
      form.reset({ name: "", group: "", address: "" });
      setUpdatingGuestId(null);

      setReadyToOpenWhatsapp({
        name: res.data.name,
        code: res.data.code,
      });
    } catch (err) {
      handleError(err, "guest");
    } finally {
      setLoadingWhastapp(false);
    }
  };

  const onDelete = async () => {
    try {
      if (!deletingGuestId) return;
      setLoading(true);
      await GuestService.deleteGuest(params.id, deletingGuestId);
      toast.success("Tamu berhasil dihapus.");
      deleteGuestFromInvitation(params.id, deletingGuestId);
    } catch (error: unknown) {
      handleError(error, "guest");
    } finally {
      setLoading(false);
      setDeletingGuestId(null);
      setDeletingGuestName(null);
    }
  };

  const onOpenModalEdit = (id: string) => {
    setUpdatingGuestId(id);
    setIsModalAddOpen(true);
    const guest = initialData?.guests?.find((item) => item.id === id);
    form.reset({
      name: guest?.name,
      group: guest?.group,
      address: guest?.address,
    });
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const capitalizeWords = (text: string): string => {
    return text
      .trim()
      .split(/\s+/)
      .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const onClickWhatsApp = (guestName: string, code: string) => {
    const template =
      initialData?.setting?.whatsappMessageTemplate ??
      defaultWhatsappMessageTemplate;
    const message = renderTemplate(template, {
      name: guestName,
      brideName: capitalizeWords(initialData?.couple?.brideName || ""),
      groomName: capitalizeWords(initialData?.couple?.groomName || ""),
      invitationLink: `${process.env.NEXT_PUBLIC_BASE_URL}/${initialData?.slug}/${code}`,
    });

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (!readyToOpenWhatsapp || !initialData) return;

    const template =
      initialData?.setting?.whatsappMessageTemplate ??
      defaultWhatsappMessageTemplate;

    const message = renderTemplate(template, {
      name: readyToOpenWhatsapp.name,
      brideName: capitalizeWords(initialData?.couple?.brideName || ""),
      groomName: capitalizeWords(initialData?.couple?.groomName || ""),
      invitationLink: `${process.env.NEXT_PUBLIC_BASE_URL}/${initialData?.slug}/${readyToOpenWhatsapp.code}`,
    });

    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    setReadyToOpenWhatsapp(null);
  }, [readyToOpenWhatsapp, initialData]);

  const onCopy = async (type: "text" | "link") => {
    try {
      const template =
        initialData?.setting?.whatsappMessageTemplate ??
        defaultWhatsappMessageTemplate;
      const message = renderTemplate(template, {
        name: selectedGuest?.name ?? "",
        brideName: capitalizeWords(initialData?.couple?.brideName || ""),
        groomName: capitalizeWords(initialData?.couple?.groomName || ""),
        invitationLink: `${process.env.NEXT_PUBLIC_BASE_URL}/${
          initialData?.slug
        }/${selectedGuest?.code || ""}`,
      });
      const text =
        type === "text"
          ? message
          : `${process.env.NEXT_PUBLIC_BASE_URL}/${initialData?.slug}/${
              selectedGuest?.code || ""
            }`;
      await navigator.clipboard.writeText(text);
      toast.success(
        `${
          type === "text" ? "Teks undangan" : "Link undangan"
        } berhasil disalin`
      );
    } catch (err) {
      toast.error(
        `${type === "text" ? "Teks undangan" : "Link undangan"} gagal disalin`
      );
      console.error("Failed to copy", err);
    }
  };

  const onCheckIn = async (guestId: string, name: string) => {
    try {
      setLoadingCheckInId(guestId);
      const res = await GuestService.checkInGuest(params.id, guestId);
      checkInGuestInInvitation(params.id, res.data.id, res.data.checkedInAt);
      toast.success(`${name} berhasil check-in.`);
    } catch (error) {
      handleError(error, "checkin");
    } finally {
      setLoadingCheckInId(null);
    }
  };

  const onCheckOut = async (guestId: string, name: string) => {
    try {
      setLoadingCheckOutId(guestId);
      const res = await GuestService.checkOutGuest(params.id, guestId);
      checkOutGuestInInvitation(params.id, res.data.id, res.data.checkedOutAt);
      toast.success(`${name} berhasil check-out.`);
    } catch (error) {
      handleError(error, "checkout");
    } finally {
      setLoadingCheckOutId(null);
    }
  };

  const handleExport = () => {
    const transformedData =
      initialData?.guests?.map((guest, index) => ({
        No: index + 1,
        Nama: guest.name,
        "Kode Tamu": guest.code,
        Grup: guest.group || "-",
        Alamat: guest.address || "-",
        RSVP: guest.isAttending ? "Ya" : "Tidak",
        Jumlah: guest.totalGuests || 0,
        Catatan: guest.notes || "-",
        "Check-In": guest.checkedInAt || "",
        "Check-Out": guest.checkedOutAt || "",
        "Link Undangan": `${process.env.NEXT_PUBLIC_BASE_URL}/${initialData?.slug}/${guest.code}`,
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
    XLSX.writeFile(workbook, "buku-tamu.xlsx");
  };

  const filteredGuest = useMemo(() => {
    return initialData?.guests.filter((guest) =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialData?.guests, searchTerm]);

  const guestPerPage = 10;
  const totalPages = Math.ceil((filteredGuest || []).length / guestPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const sortedGuests = [...(filteredGuest || [])].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "checkin-desc":
        return (
          new Date(b.checkedInAt || 0).getTime() -
          new Date(a.checkedInAt || 0).getTime()
        );
      case "checkin-asc":
        return (
          new Date(a.checkedInAt || 0).getTime() -
          new Date(b.checkedInAt || 0).getTime()
        );
      case "created-desc":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "created-asc":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  const currentGuests = sortedGuests.slice(
    (currentPage - 1) * guestPerPage,
    currentPage * guestPerPage
  );

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <>
      <Modal
        title="Tambah Tamu"
        isOpen={isModalAddOpen}
        onClose={() => {
          setIsModalAddOpen(false);
          if (updatingGuestId) {
            form.reset({
              name: "",
              group: "",
              address: "",
            });
            setUpdatingGuestId(null);
          }
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Nama Tamu Undangan
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      disabled={loading}
                      placeholder="Azhmi Fauzi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="not-italic">
                    Nama ini akan muncul di undangan tamu. Untuk mengatur format
                    pesan WhatsApp, buka menu&nbsp;
                    <Link
                      href="setting"
                      className="text-green-app-primary hover:text-green-app-secondary transition-colors"
                    >
                      Penganturan
                    </Link>
                    .
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Grup</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      disabled={loading}
                      placeholder="Teman Kuliah"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Alamat</FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      disabled={loading}
                      className="h-44"
                      placeholder="Villa Azila, Cipayung, Jakarta Timur"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row items-center justify-end gap-3">
              <Button
                variant="primary"
                isLoading={loadingWhastapp}
                disabled={loadingWhastapp || loading}
                className="w-full md:w-auto"
                type="button"
                onClick={form.handleSubmit(onSubmitWhatsApp)}
              >
                <IoLogoWhatsapp size={20} />
                {updatingGuestId ? <>Ubah</> : <>Simpan</>} & Kirim
              </Button>
              <Button
                variant="primary"
                isLoading={loading}
                disabled={loading || loadingWhastapp}
                className="w-full md:w-auto"
                type="submit"
              >
                {updatingGuestId ? (
                  <>
                    <Pencil />
                    Ubah
                  </>
                ) : (
                  <>
                    <Save />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
      <Modal
        title="Share Link"
        isOpen={isModalShareLinkOpen}
        onClose={() => {
          setIsModalShareLinkOpen(false);
        }}
      >
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Nama Tamu</p>
            <p className="font-medium">
              {capitalizeWords(selectedGuest?.name || "")}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Kode Tamu</p>
            <p className="font-mono text-sm">{selectedGuest?.code || ""}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Link Undangan</p>
            <p className="text-blue-600 break-all underline">
              {process.env.NEXT_PUBLIC_BASE_URL}/{initialData?.slug}/
              {selectedGuest?.code || ""}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-2">
            <Button
              variant="primary"
              onClick={() => onCopy("text")}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Teks Undangan
            </Button>

            <Button
              variant="primary"
              onClick={() => onCopy("link")}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Link Undangan
            </Button>
          </div>
        </div>
      </Modal>
      <DeleteConfirmationModal
        description={`tamu a.n ${deletingGuestName}`}
        isOpen={isModalDeleteOpen}
        onOpenChange={() => {
          setDeletingGuestId(null);
          setDeletingGuestName(null);
          setIsModalDeleteOpen(false);
        }}
        onConfirm={onDelete}
        loading={loading}
      />
      <Alert variant="default" className="mb-4">
        Sebelum menambahkan tamu undangan, pastikan link undangan sudah sesuai.
        Untuk mengubah link undangan, buka menu&nbsp;
        <Link
          href="setting"
          className="text-pink-500 hover:text-pink-600 transition-colors"
        >
          Pengaturan
        </Link>
        .
      </Alert>
      <div className="space-y-4 card-dashboard ">
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
          <Input
            id="search"
            type="search"
            placeholder="Cari tamu undangan..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full md:w-1/3"
            autoComplete="off"
            isFetching={isFetching}
          />

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button
              onClick={() => setIsModalAddOpen(true)}
              variant="primary"
              className="flex-1 md:flex-none"
              isFetching={isFetching}
            >
              <Plus className="w-4 h-4" />
              Tambah Tamu
            </Button>

            <Button
              onClick={() => router.push("guestbook/import")}
              variant="outline"
              className="flex-1 md:flex-none"
              isFetching={isFetching}
            >
              <Upload className="w-4 h-4" />
              Import
            </Button>

            <Button
              onClick={handleExport}
              variant="outline"
              className="flex-1 md:flex-none"
              isFetching={isFetching}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger
                isFetching={isFetching}
                className="w-full md:w-[180px] flex-1 md:flex-none"
              >
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created-desc">Tanggal Terbaru</SelectItem>
                <SelectItem value="created-asc">Tanggal Terlama</SelectItem>
                <SelectItem value="name-asc">Nama A-Z</SelectItem>
                <SelectItem value="name-desc">Nama Z-A</SelectItem>
                <SelectItem value="checkin-desc">Check-in Terbaru</SelectItem>
                <SelectItem value="checkin-asc">Check-in Terlama</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isFetching ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <GuestBookCardSkeleton key={i} />
            ))}
          </div>
        ) : (currentGuests?.length ?? 0) > 0 ? (
          <div className="space-y-4">
            {(currentGuests || []).map((guest) => (
              <GuestBookCard
                key={guest.id}
                data={guest}
                onEdit={(id: string) => onOpenModalEdit(id)}
                onDelete={(id: string, name: string) => {
                  setDeletingGuestId(id);
                  setDeletingGuestName(name);
                  setIsModalDeleteOpen(true);
                }}
                onShareWhatsApp={(guestName: string, code: string) => {
                  onClickWhatsApp(guestName, code);
                }}
                onShareLink={(guest: Guest) => {
                  setIsModalShareLinkOpen(true);
                  setSelectedGuest(guest);
                }}
                onViewInvitation={(code: string) =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/${initialData?.slug}/${code}`,
                    "_blank"
                  )
                }
                onCheckIn={(guestId: string, name: string) =>
                  onCheckIn(guestId, name)
                }
                onCheckOut={(guestId: string, name: string) =>
                  onCheckOut(guestId, name)
                }
                checkInOrCheckOutId={
                  (loadingCheckInId || loadingCheckOutId) ?? undefined
                }
              />
            ))}
          </div>
        ) : currentGuests?.length === 0 &&
          (initialData?.guests || []).length > 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <Image
              src="/assets/img//guestbook-green.png"
              alt="Icon guest book"
              aspectRatio="aspect-square"
              className="w-20 mb-5"
            />
            <p className="text-sm font-medium">Tamu tidak ditemukan</p>
            <p className="text-xs">Coba gunakan kata kunci lain.</p>
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <Image
              src="/assets/img/guestbook-green.png"
              alt="Icon guest book"
              aspectRatio="aspect-square"
              className="w-20 mb-5"
            />
            <p className="text-sm font-medium">Tamu tidak ditemukan</p>
            <p className="text-xs">Kamu belum menambahkan tamu undangan.</p>
          </div>
        )}

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
      </div>
    </>
  );
};

export default GuestBookForm;
