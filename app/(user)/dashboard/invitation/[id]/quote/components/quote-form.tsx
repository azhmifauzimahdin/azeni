"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { QuoteService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import { Invitation } from "@/types";
import useInvitationStore from "@/stores/invitation-store";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import { createQuoteSchema } from "@/lib/schemas/quote";

type QuoteFormValues = z.infer<typeof createQuoteSchema>;

interface QuoteFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const QuoteForm: React.FC<QuoteFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const updateQuoteInInvitation = useInvitationStore(
    (state) => state.updateQuoteInInvitation
  );
  const deleteQuoteInInvitation = useInvitationStore(
    (state) => state.deleteQuoteInInvitation
  );

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [deletingQuoteId, setDeletingQuoteId] = useState<string | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(createQuoteSchema),
    defaultValues: initialData?.quote
      ? {
          name: initialData.quote.name,
          author: initialData.quote.author,
        }
      : {
          name: "",
          author: "",
        },
  });

  useEffect(() => {
    if (initialData?.quote) {
      form.reset({
        name: initialData.quote.name,
        author: initialData.quote.author,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: QuoteFormValues) => {
    try {
      setLoadingSubmit(true);
      const res = await QuoteService.createQuote(params.id, data);
      updateQuoteInInvitation(params.id, res.data);
      toast.success("Quote berhasil disimpan.");
    } catch (error: unknown) {
      handleError(error, "quote");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoadingDelete(true);
      if (deletingQuoteId) {
        await QuoteService.deleteQuote(params.id, deletingQuoteId);
      }
      toast.success("Quote berhasil dihapus.");
      deleteQuoteInInvitation(params.id);
      form.reset({
        name: "",
        author: "",
      });
    } catch (error: unknown) {
      handleError(error, "quote");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <DeleteConfirmationModal
        description="quote"
        isOpen={isModalDeleteOpen}
        onOpenChange={() => {
          setDeletingQuoteId(null);
          setIsModalDeleteOpen(false);
        }}
        onConfirm={onDelete}
        loading={loadingDelete}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 card-dashboard"
        >
          <div className="grid grid-cols-1 items-end justify-end gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Quote
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      placeholder="Quote"
                      disabled={loadingSubmit || loadingDelete}
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
                  <FormLabel htmlFor={field.name} required>
                    Author
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="Author"
                      disabled={loadingSubmit || loadingDelete}
                      size={12}
                      isFetching={isFetching}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-end gap-3">
            <Button
              variant="primary"
              isLoading={loadingSubmit}
              disabled={loadingSubmit || loadingDelete}
              className="w-full md:w-auto md:order-2"
              type="submit"
              isFetching={isFetching}
            >
              <Save /> Simpan
            </Button>
            {initialData?.quote ? (
              <Button
                variant="destructive"
                isLoading={deletingQuoteId ? true : false}
                disabled={loadingSubmit || loadingDelete}
                onClick={() => {
                  setIsModalDeleteOpen(true);
                  setDeletingQuoteId(initialData?.quote?.id || "xxxx");
                }}
                className="w-full md:w-auto"
                type="button"
                isFetching={isFetching}
              >
                <Trash2 /> Hapus
              </Button>
            ) : null}
          </div>
        </form>
      </Form>
    </>
  );
};

export default QuoteForm;
