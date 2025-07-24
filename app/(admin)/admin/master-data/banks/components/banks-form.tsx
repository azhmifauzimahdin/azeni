"use client";

import { Bank } from "@/types";
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
  FormLabelText,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import ImageUpload from "./upload-image";
import { BankService, ImageService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import { bankSchema } from "@/lib/schemas/bank";
import useAdminBankStore from "@/stores/admin-bank-store";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";

type BankFormValues = z.infer<typeof bankSchema>;

interface BanksFormProps {
  initialData: Bank[] | undefined;
  isFetching?: boolean;
}

const BanksForm: React.FC<BanksFormProps> = ({ initialData, isFetching }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false);
  const [updatingBankId, setUpdatingBankId] = useState<string | null>(null);
  const [deletingBankId, setDeletingBankId] = useState<string | null>(null);
  const [deletingBankName, setDeletingBankName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageDelete, setImageDelete] = useState<string[]>([]);

  const upsertBankAtFirst = useAdminBankStore(
    (state) => state.upsertBankAtFirst
  );
  const deleteBankById = useAdminBankStore((state) => state.deleteBankById);

  const form = useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      name: "",
      icon: "",
    },
  });

  const onSubmit = async (data: BankFormValues) => {
    try {
      setIsLoading(true);
      await deleteAllImages();
      let res;
      if (updatingBankId)
        res = await BankService.updateBank(updatingBankId, data);
      else res = await BankService.createBank(data);
      upsertBankAtFirst(res.data);
      if (updatingBankId) toast.success("Bank berhasil diubah.");
      else toast.success("Bank berhasil disimpan.");
      setIsModalOpen(false);
      form.reset({
        name: "",
        icon: "",
      });
      setUpdatingBankId(null);
    } catch (error: unknown) {
      handleError(error, "bank");
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenModalEdit = (id: string) => {
    setUpdatingBankId(id);
    setIsModalOpen(true);
    const bank = initialData?.find((item) => item.id === id);
    form.reset({
      name: bank?.name,
      icon: bank?.icon,
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

  const onDelete = async () => {
    try {
      if (!deletingBankId) return;
      setIsLoading(true);
      await BankService.deleteBank(deletingBankId);
      toast.success("Bank berhasil dihapus.");
      deleteBankById(deletingBankId);
    } catch (error) {
      handleError(error, "bank");
    } finally {
      setIsLoading(false);
      setDeletingBankId(null);
      setDeletingBankName(null);
    }
  };

  return (
    <>
      <Modal
        title={`${updatingBankId ? "Ubah" : "Tambah"} Bank`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (updatingBankId) {
            form.reset({
              name: "",
              icon: "",
            });
            setUpdatingBankId(null);
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
                      placeholder="Bank Syariah Indonesia"
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
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabelText required>Logo</FormLabelText>
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
                      path="image/banks"
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
                {updatingBankId ? (
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
        description={`bank ${deletingBankName}`}
        isOpen={isModalDeleteOpen}
        onOpenChange={() => {
          setDeletingBankId(null);
          setDeletingBankName(null);
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
                setDeletingBankId(id);
                setDeletingBankName(name);
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

export default BanksForm;
