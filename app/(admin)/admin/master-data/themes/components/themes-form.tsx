"use client";

import { Music, Theme, ThemeCategory } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Modal from "@/components/ui/modal";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormLabelText,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { ImageService, ThemeService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import toast from "react-hot-toast";
import { createThemeFormSchema } from "@/lib/schemas/theme";
import useAdminThemeStore from "@/stores/admin-theme-store";
import ImageUpload from "./image-upload";
import Combobox from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateSlug } from "@/lib/utils/slugify";
import DateTimeInput from "@/components/ui/date-time-input";

type ThemeFormValues = z.infer<typeof createThemeFormSchema>;

interface ThemeFormProps {
  initialData: Theme[] | undefined;
  filter: ThemeCategory[] | undefined;
  musics: Music[] | undefined;
  isFetching?: boolean;
}

const ThemesForm: React.FC<ThemeFormProps> = ({
  initialData,
  filter,
  musics,
  isFetching,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [updatingThemeId, setUpdatingThemeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageDelete, setImageDelete] = useState<string[]>([]);

  const CategoryOptions = useMemo(() => {
    if (!filter) return [];
    return filter.map((data) => ({
      value: data.id,
      label: data.name,
      searchText: data.name,
    }));
  }, [filter]);

  const MusicOptions = useMemo(() => {
    if (!musics) return [];
    return musics.map((data) => ({
      value: data.id,
      label: data.name,
      searchText: data.name,
    }));
  }, [musics]);

  const upsertThemeAtFirst = useAdminThemeStore(
    (state) => state.upsertThemeAtFirst
  );

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(createThemeFormSchema),
    defaultValues: {
      name: "",
      thumbnail: "",
      colorTag: "",
      originalPrice: "0",
      categoryId: "",
      discount: "0",
      isPercent: false,
      groom: "",
      bride: "",
      slug: "",
      image: "",
      musicId: "",
      date: new Date(),
      expiresAt: new Date(),
    },
  });

  const isPercent = form.watch("isPercent");
  const name = form.watch("name");

  useEffect(() => {
    form.setValue("slug", generateSlug(name));
  }, [form, name]);

  const onSubmit = async (data: ThemeFormValues) => {
    try {
      setIsLoading(true);
      await deleteAllImages();
      let res;
      if (updatingThemeId)
        res = await ThemeService.updateTheme(updatingThemeId, data);
      else res = await ThemeService.createTheme(data);
      console.log("res.data : ", res.data);
      upsertThemeAtFirst(res.data);
      if (updatingThemeId) toast.success("Tema berhasil diubah.");
      else toast.success("Tema berhasil disimpan.");
      setIsModalOpen(false);
      form.reset({
        name: "",
        thumbnail: "",
        colorTag: "",
        originalPrice: "0",
        categoryId: "",
        discount: "0",
        isPercent: false,
        groom: "",
        bride: "",
        slug: "",
        image: "",
        musicId: "",
        date: new Date(),
        expiresAt: new Date(),
      });
      setUpdatingThemeId(null);
    } catch (error: unknown) {
      handleError(error, "theme");
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenModalEdit = (id: string) => {
    setUpdatingThemeId(id);
    setIsModalOpen(true);
    const theme = initialData?.find((item) => item.id === id);
    form.reset({
      name: theme?.name,
      thumbnail: theme?.thumbnail,
      colorTag: theme?.colorTag,
      originalPrice: theme?.originalPrice,
      categoryId: theme?.categoryId,
      discount: theme?.discount,
      isPercent: theme?.isPercent,
      groom: theme?.invitation?.groom,
      bride: theme?.invitation?.bride,
      slug: theme?.invitation?.slug,
      image: theme?.invitation?.image,
      musicId: theme?.invitation?.musicId,
      date: new Date(theme?.invitation?.date || new Date().getTime()),
      expiresAt: new Date(theme?.invitation?.expiresAt || new Date().getTime()),
    });
  };

  const onDeleteImage = async (publicId: string) => {
    try {
      setIsLoading(true);
      await ImageService.deleteImageByPublicId(publicId);
    } catch (error) {
      handleError(error, "image");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllImages = async () => {
    await Promise.all(imageDelete.map((id) => onDeleteImage(id)));
    setImageDelete([]);
  };

  return (
    <>
      <Modal
        title={`${updatingThemeId ? "Ubah" : "Tambah"} Tema`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (updatingThemeId) {
            form.reset({
              name: "",
              thumbnail: "",
              colorTag: "",
              originalPrice: "0",
              categoryId: "",
              discount: "0",
              isPercent: false,
              groom: "",
              bride: "",
              slug: "",
              image: "",
              musicId: "",
              date: new Date(),
              expiresAt: new Date(),
            });
            setUpdatingThemeId(null);
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
                      placeholder="Premium-001"
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
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabelText required>Thumbnail</FormLabelText>
                  <FormControl>
                    <ImageUpload
                      id={field.name}
                      disabled={isLoading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={(publicId) => {
                        setImageDelete((prev) => [...prev, publicId]);
                        field.onChange("");
                      }}
                      value={field.value || ""}
                      path="image/themes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Kategori
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      id={field.name}
                      options={CategoryOptions}
                      placeholder="kategori"
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
              name="colorTag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Warna
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="Green"
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
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Harga
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      type="currency"
                      placeholder="20000"
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
              name="isPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Jenis Diskon
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? "percent" : "flat"}
                      onValueChange={(val) => field.onChange(val === "percent")}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis diskon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">Flat (Rp)</SelectItem>
                        <SelectItem value="percent">Persen (%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Pilih apakah diskon berupa nominal atau persen.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Diskon
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      type={isPercent ? "percent" : "currency"}
                      placeholder={isPercent ? "10" : "20000"}
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
              name="groom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Pria
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="Rey"
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
              name="bride"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Wanita
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="Dinda"
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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Slug
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="premium-001"
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabelText required>Foto</FormLabelText>
                  <FormControl>
                    <ImageUpload
                      id={field.name}
                      disabled={isLoading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={(publicId) => {
                        setImageDelete((prev) => [...prev, publicId]);
                        field.onChange("");
                      }}
                      value={field.value || ""}
                      path="users/invitations"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="musicId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Musik
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      id={field.name}
                      options={MusicOptions}
                      placeholder="musik"
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Tanggal
                  </FormLabel>
                  <FormControl>
                    <DateTimeInput
                      id={field.name}
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
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Tanggal
                  </FormLabel>
                  <FormControl>
                    <DateTimeInput
                      id={field.name}
                      disabled={isLoading}
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
                isLoading={isLoading}
                className="w-full md:w-auto"
                type="submit"
              >
                {updatingThemeId ? (
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
      <Card>
        <CardContent className="p-3">
          <DataTable
            columns={columns({
              onEdit: (id) => onOpenModalEdit(id),
            })}
            data={initialData || []}
            filter={filter || []}
            isFetching={isFetching}
            onAddClick={() => setIsModalOpen(true)}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ThemesForm;
