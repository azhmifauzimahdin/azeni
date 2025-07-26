"use client";

import { ThemeCategory } from "@/types";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { ThemeCategoryService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import toast from "react-hot-toast";
import { themeCategorySchema } from "@/lib/schemas/theme-category";
import useAdminThemeCategoryStore from "@/stores/admin-theme-category-store";

type ThemeCategoryFormValues = z.infer<typeof themeCategorySchema>;

interface ThemeCategoryFormProps {
  initialData: ThemeCategory[] | undefined;
  isFetching?: boolean;
}

const ThemeCategoryForm: React.FC<ThemeCategoryFormProps> = ({
  initialData,
  isFetching,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [updatingThemeCategoryId, setUpdatingThemeCategoryId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const upsertThemeCategoryAtFirst = useAdminThemeCategoryStore(
    (state) => state.upsertThemeCategoryAtFirst
  );

  const form = useForm<ThemeCategoryFormValues>({
    resolver: zodResolver(themeCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: ThemeCategoryFormValues) => {
    try {
      setIsLoading(true);
      let res;
      if (updatingThemeCategoryId)
        res = await ThemeCategoryService.updateThemeCategory(
          updatingThemeCategoryId,
          data
        );
      else res = await ThemeCategoryService.createThemeCategory(data);
      upsertThemeCategoryAtFirst(res.data);
      if (updatingThemeCategoryId)
        toast.success("Kategori tema berhasil diubah.");
      else toast.success("Kategori tema berhasil disimpan.");
      setIsModalOpen(false);
      form.reset({
        name: "",
      });
      setUpdatingThemeCategoryId(null);
    } catch (error: unknown) {
      handleError(error, "Kategori tema");
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenModalEdit = (id: string) => {
    setUpdatingThemeCategoryId(id);
    setIsModalOpen(true);
    const themeCategory = initialData?.find((item) => item.id === id);
    form.reset({
      name: themeCategory?.name,
    });
  };

  return (
    <>
      <Modal
        title={`${updatingThemeCategoryId ? "Ubah" : "Tambah"} Kategori Tema`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (updatingThemeCategoryId) {
            form.reset({
              name: "",
            });
            setUpdatingThemeCategoryId(null);
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
                      placeholder="Premium"
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
                {updatingThemeCategoryId ? (
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
            isFetching={isFetching}
            onAddClick={() => setIsModalOpen(true)}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ThemeCategoryForm;
