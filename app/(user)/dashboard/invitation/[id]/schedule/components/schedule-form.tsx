"use client";

import * as z from "zod";

import { Invitation } from "@/types";
import { CalendarDays, Pencil, Save } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import CreatableCombobox from "@/components/ui/creatable-combobox";
import DateTimeInput from "@/components/ui/date-time-input";
import { Input } from "@/components/ui/input";
import { ScheduleService } from "@/lib/services";
import toast from "react-hot-toast";
import axios from "axios";
import { handleError } from "@/lib/utils/handle-error";
import useInvitationStore from "@/stores/invitation-store";
import Combobox from "@/components/ui/combobox";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import { ScheduleCard, ScheduleCardSkeleton } from "./schedule-card";

const today = new Date();
today.setHours(0, 0, 0, 0);
const formSchema = z
  .object({
    name: z.string().min(1, { message: "Nama Acara wajib dipilih" }),
    startDate: z.date().refine((date) => date >= today, {
      message: "Tanggal harus hari ini atau lebih",
    }),
    endDate: z.date().refine((date) => date >= today, {
      message: "Tanggal harus hari ini atau lebih",
    }),
    timezone: z.string().min(1, { message: "Zona waktu wajib diisi" }),
    location: z.string().min(1, { message: "Lokasi wajib diisi" }),
    locationMaps: z.string().min(1, { message: "Maps wajib diisi" }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Tanggal selesai harus setelah atau sama dengan tanggal mulai",
    path: ["endDate"],
  });

type ScheduleFormValues = z.infer<typeof formSchema>;
interface ScheduleFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const ScheduleForm: React.FC<ScheduleFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingScheduleId, setUpdatingScheduleId] = useState<string | null>(
    null
  );
  const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(
    null
  );

  const addOrUpdateScheduleToInvitation = useInvitationStore(
    (state) => state.addOrUpdateScheduleToInvitation
  );
  const deleteScheduleFromInvitation = useInvitationStore(
    (state) => state.deleteScheduleFromInvitation
  );

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
      timezone: "",
      location: "",
      locationMaps: "",
    },
  });

  const onSubmit = async (data: ScheduleFormValues) => {
    try {
      setLoading(true);
      let res;
      if (updatingScheduleId)
        res = await ScheduleService.updateSchedule(
          params.id,
          updatingScheduleId,
          data
        );
      else res = await ScheduleService.createSchedule(params.id, data);
      addOrUpdateScheduleToInvitation(params.id, res);
      toast.success("Jadwal acara berhasil disimpan.");
      setIsModalOpen(false);
      form.reset({
        name: "",
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
        timezone: "",
        location: "",
        locationMaps: "",
      });
      setUpdatingScheduleId(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error(error.response.data);
        } else {
          handleError(error, "schedule");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const onOpenModalEdit = (id: string) => {
    setUpdatingScheduleId(id);
    setIsModalOpen(true);
    const schedule = initialData?.schedules?.find((item) => item.id === id);
    form.reset({
      name: schedule?.type,
      startDate: new Date(schedule?.startDate || new Date().getTime()),
      endDate: new Date(schedule?.endDate || new Date().getTime()),
      timezone: schedule?.timezone,
      location: schedule?.location,
      locationMaps: schedule?.locationMaps,
    });
  };

  const onDelete = async () => {
    try {
      if (!deletingScheduleId) return;
      setLoading(true);
      await ScheduleService.deleteSchedule(params.id, deletingScheduleId);
      toast.success("Jadwal acara berhasil dihapus.");
      deleteScheduleFromInvitation(params.id, deletingScheduleId);
    } catch (error: unknown) {
      handleError(error, "bank");
    } finally {
      setLoading(false);
      setDeletingScheduleId(null);
    }
  };

  return (
    <>
      <Modal
        title={`${updatingScheduleId ? "Ubah" : "Tambah"} Jadwal Acara`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (updatingScheduleId) {
            form.reset({
              name: "",
              startDate: new Date(),
              endDate: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
              timezone: "",
              location: "",
              locationMaps: "",
            });
            setUpdatingScheduleId(null);
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
                  <FormLabel required>Nama Acara</FormLabel>
                  <FormControl>
                    <CreatableCombobox
                      options={[
                        {
                          value: "marriage",
                          label: "Akad Nikah",
                          searchText: "akad nikah",
                        },
                        {
                          value: "reception",
                          label: "Resepsi",
                          searchText: "Resepsi",
                        },
                      ]}
                      placeholder="atau masukkan nama acara"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Mulai Acara
                  </FormLabel>
                  <FormControl>
                    <DateTimeInput
                      id={field.name}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Selesai Acara
                  </FormLabel>
                  <FormControl>
                    <DateTimeInput
                      id={field.name}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Zona Waktu
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={[
                        {
                          value: "WIT",
                          label: "WIT",
                          searchText: "WIT",
                        },
                        {
                          value: "WITA",
                          label: "WITA",
                          searchText: "WITA",
                        },
                        {
                          value: "WIB",
                          label: "WIB",
                          searchText: "WIB",
                        },
                      ]}
                      placeholder="Zona Waktu"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Lokasi
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="Villa Azila, Cipayung, Jakarta Timur"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationMaps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Maps
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="https://maps.app.goo.gl/6Ti5v9FkwVf5gkhx6"
                      disabled={loading}
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
                isLoading={loading}
                className="w-full md:w-auto"
                type="submit"
              >
                {updatingScheduleId ? (
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
      <DeleteConfirmationModal
        description="jadwal acara"
        isOpen={isModalDeleteOpen}
        onOpenChange={() => {
          setDeletingScheduleId(null);
          setIsModalDeleteOpen(false);
        }}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="space-y-4 card-dashboard ">
        {isFetching ? (
          <div className="flex items-center gap-3 bg-muted text-muted-foreground rounded-lg shadow p-4 max-w-md animate-pulse">
            <div className="w-8 h-8 bg-skeleton rounded" />
            <div className="h-4 w-40 bg-skeleton rounded" />
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-green-app-primary text-white rounded-lg shadow p-4 cursor-pointer hover:bg-green-app-secondary max-w-md"
          >
            <CalendarDays size={32} />
            <span className="font-medium">Tambah Jadwal Acara</span>
          </div>
        )}
        <div className="text-base text-slate-600">Jadwal Acara</div>

        {isFetching ? (
          <div className="relative">
            <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-4 pl-2">
              {[...Array(3)].map((_, i) => (
                <ScheduleCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (initialData?.schedules?.length ?? 0) > 0 ? (
          <div className="relative">
            <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-4 pl-2">
              {initialData?.schedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  data={schedule}
                  onClick={(id: string) => onOpenModalEdit(id)}
                  onDelete={(id: string) => {
                    setDeletingScheduleId(id);
                    setIsModalDeleteOpen(true);
                  }}
                  isLoadingDelete={deletingScheduleId === schedule.id}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ScheduleForm;
