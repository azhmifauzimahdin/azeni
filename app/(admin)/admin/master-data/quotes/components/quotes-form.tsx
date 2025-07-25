"use client";

import { QuoteTemplate } from "@/types";
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
import { QuoteTemplateService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import useAdminQuoteTemplateStore from "@/stores/admin-quote-template-store";
import { createQuoteSchema } from "@/lib/schemas/quote";
import { Textarea } from "@/components/ui/textarea";

type QuoteTemplateFormValues = z.infer<typeof createQuoteSchema>;

interface QuoteTemplateFormProps {
  initialData: QuoteTemplate[] | undefined;
  isFetching?: boolean;
}

const QuotesForm: React.FC<QuoteTemplateFormProps> = ({
  initialData,
  isFetching,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false);
  const [updatingQuoteTemplateId, setUpdatingQuoteTemplateId] = useState<
    string | null
  >(null);
  const [deletingQuoteTemplateId, setDeletingQuoteTemplateId] = useState<
    string | null
  >(null);
  const [deletingQuoteTemplateName, setDeletingQuoteTemplateName] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const upsertQuoteTemplateAtFirst = useAdminQuoteTemplateStore(
    (state) => state.upsertQuoteTemplateAtFirst
  );
  const deleteQuoteTemplateById = useAdminQuoteTemplateStore(
    (state) => state.deleteQuoteTemplateById
  );

  const form = useForm<QuoteTemplateFormValues>({
    resolver: zodResolver(createQuoteSchema),
    defaultValues: {
      name: "",
      author: "",
    },
  });

  const onSubmit = async (data: QuoteTemplateFormValues) => {
    try {
      setIsLoading(true);
      let res;
      if (updatingQuoteTemplateId)
        res = await QuoteTemplateService.updateQuoteTemplates(
          updatingQuoteTemplateId,
          data
        );
      else res = await QuoteTemplateService.createQuoteTemplates(data);
      upsertQuoteTemplateAtFirst(res.data);
      if (updatingQuoteTemplateId) toast.success("Quote berhasil diubah.");
      else toast.success("Quote berhasil disimpan.");
      setIsModalOpen(false);
      form.reset({
        name: "",
        author: "",
      });
      setUpdatingQuoteTemplateId(null);
    } catch (error: unknown) {
      handleError(error, "quote template");
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenModalEdit = (id: string) => {
    setUpdatingQuoteTemplateId(id);
    setIsModalOpen(true);
    const quoteTemplate = initialData?.find((item) => item.id === id);
    form.reset({
      name: quoteTemplate?.name,
      author: quoteTemplate?.author,
    });
  };

  const onDelete = async () => {
    try {
      if (!deletingQuoteTemplateId) return;
      setIsLoading(true);
      await QuoteTemplateService.deleteQuoteTemplates(deletingQuoteTemplateId);
      toast.success("Quote berhasil dihapus.");
      deleteQuoteTemplateById(deletingQuoteTemplateId);
    } catch (error) {
      handleError(error, "quote template");
    } finally {
      setIsLoading(false);
      setDeletingQuoteTemplateId(null);
      setDeletingQuoteTemplateName(null);
    }
  };

  return (
    <>
      <Modal
        title={`${updatingQuoteTemplateId ? "Ubah" : "Tambah"} Quote`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (updatingQuoteTemplateId) {
            form.reset({
              name: "",
              author: "",
            });
            setUpdatingQuoteTemplateId(null);
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
                    Quote
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      placeholder="Quote"
                      disabled={isLoading}
                      className="h-44"
                      isFetching={isFetching}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Author
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="Author"
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
                {updatingQuoteTemplateId ? (
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
        description={`${deletingQuoteTemplateName}`}
        isOpen={isModalDeleteOpen}
        onOpenChange={() => {
          setDeletingQuoteTemplateId(null);
          setDeletingQuoteTemplateName(null);
          setIsModalDeleteOpen(false);
        }}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <Card>
        <CardContent className="p-3">
          <DataTable
            columns={columns({
              onEdit: (id) => onOpenModalEdit(id),
              onDelete: (id, name) => {
                setDeletingQuoteTemplateId(id);
                setDeletingQuoteTemplateName(name);
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

export default QuotesForm;
