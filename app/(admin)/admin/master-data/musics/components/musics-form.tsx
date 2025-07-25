"use client";

import { Music } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { MusicService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import { apiMusicSchema } from "@/lib/schemas/music";
import useAdminMusicStore from "@/stores/admin-music-store";
import { Switch } from "@/components/ui/switch";
import MusicPlayer from "@/components/ui/music-player";

type MusicFormValues = z.infer<typeof apiMusicSchema>;

interface MusicsFormProps {
  initialData: Music[] | undefined;
  isFetching?: boolean;
}

const MusicsForm: React.FC<MusicsFormProps> = ({ initialData, isFetching }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false);
  const [updatingMusicId, setUpdatingMusicId] = useState<string | null>(null);
  const [deletingMusicId, setDeletingMusicId] = useState<string | null>(null);
  const [deletingMusicName, setDeletingMusicName] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const upsertMusicAtFirst = useAdminMusicStore(
    (state) => state.upsertMusicAtFirst
  );
  const deleteMusicById = useAdminMusicStore((state) => state.deleteMusicById);

  const form = useForm<MusicFormValues>({
    resolver: zodResolver(apiMusicSchema),
    defaultValues: {
      name: "",
      origin: "",
      src: "",
      visibility: true,
    },
  });

  const onSubmit = async (data: MusicFormValues) => {
    try {
      setIsLoading(true);
      let res;
      if (updatingMusicId)
        res = await MusicService.updateMusics(updatingMusicId, data);
      else res = await MusicService.createMusics(data);
      upsertMusicAtFirst(res.data);
      if (updatingMusicId) toast.success("Musik berhasil diubah.");
      else toast.success("Musik berhasil disimpan.");
      setIsModalOpen(false);
      form.reset({
        name: "",
        origin: "",
        src: "",
        visibility: true,
      });
      setUpdatingMusicId(null);
    } catch (error: unknown) {
      handleError(error, "music");
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenModalEdit = (id: string) => {
    setUpdatingMusicId(id);
    setIsModalOpen(true);
    const music = initialData?.find((item) => item.id === id);
    form.reset({
      name: music?.name,
      origin: music?.origin,
      src: music?.src,
      visibility: music?.visibility,
    });
  };

  const onDelete = async () => {
    try {
      if (!deletingMusicId) return;
      setIsLoading(true);
      await MusicService.deleteMusics(deletingMusicId);
      toast.success("Musik berhasil dihapus.");
      deleteMusicById(deletingMusicId);
    } catch (error) {
      handleError(error, "music");
    } finally {
      setIsLoading(false);
      setDeletingMusicId(null);
      setDeletingMusicName(null);
    }
  };

  return (
    <>
      <Modal
        title={`${updatingMusicId ? "Ubah" : "Tambah"} Musik`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (updatingMusicId) {
            form.reset({
              name: "",
              origin: "",
              src: "",
              visibility: true,
            });
            setUpdatingMusicId(null);
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
                    Nama
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="Ketika Cinta Bertasbih - Melly Goeslaw"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Origin
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="https://www.youtube.com/watch?v=3bao93imICs"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="src"
              render={({ field }) => {
                const value = field.value;

                return (
                  <FormItem>
                    <FormLabel required htmlFor={field.name}>
                      File Musik
                    </FormLabel>
                    <FormControl>
                      <>
                        {!value ? (
                          <Input
                            id={field.name}
                            type="file"
                            accept="audio/*"
                            disabled={isLoading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                form.setValue("src", reader.result as string, {
                                  shouldValidate: true,
                                });
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        ) : (
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <MusicPlayer id="form-preview" src={value} />
                            </div>

                            <Button
                              variant="ghost"
                              type="button"
                              size="icon"
                              className="text-destructive"
                              onClick={() =>
                                form.setValue("src", "", {
                                  shouldValidate: true,
                                })
                              }
                            >
                              <X />
                            </Button>
                          </div>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel htmlFor={field.name}>Tampilkan Musik</FormLabel>
                    <FormDescription>
                      Aktifkan jika ingin menampilkan di daftar musik.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      id={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row items-center justify-end gap-3">
              <Button
                variant="primary"
                isLoading={isLoading}
                className="w-full md:w-auto"
                type="submit"
              >
                {updatingMusicId ? (
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
        description={`${deletingMusicName}`}
        isOpen={isModalDeleteOpen}
        onOpenChange={() => {
          setDeletingMusicId(null);
          setDeletingMusicName(null);
          setIsModalDeleteOpen(false);
        }}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns({
              onEdit: (id) => onOpenModalEdit(id),
              onDelete: (id, name) => {
                setDeletingMusicId(id);
                setDeletingMusicName(name);
                setIsModalDeleteOpen(true);
              },
            })}
            data={initialData || []}
            isFetching={isFetching}
            onAddClick={() => setIsModalOpen(true)}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default MusicsForm;
