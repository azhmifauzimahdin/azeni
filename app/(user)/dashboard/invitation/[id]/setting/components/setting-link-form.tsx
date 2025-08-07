"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { updateLinkInvitationSchema } from "@/lib/schemas/invitation";
import { InvitationService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import useInvitationStore from "@/stores/invitation-store";
import { Invitation } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Link, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type SettingLinkFormValues = z.infer<typeof updateLinkInvitationSchema>;

interface SettingLinkFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const SettingLinkForm: React.FC<SettingLinkFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateSlugInInvitation = useInvitationStore(
    (state) => state.updateSlugInInvitation
  );

  const form = useForm<SettingLinkFormValues>({
    resolver: zodResolver(updateLinkInvitationSchema),
    defaultValues: {
      url: "",
    },
  });

  useEffect(() => {
    form.reset({
      url: initialData?.slug,
    });
  }, [initialData, form]);

  const onSubmit = async (data: SettingLinkFormValues) => {
    try {
      setLoading(true);
      const res = await InvitationService.updateLinkByUserId(params.id, data);
      updateSlugInInvitation(params.id, res.data.slug);
      toast.success("Link undangan berhasil diubah.");
      setIsModalOpen(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error(error.response.data.message);
        } else {
          handleError(error, "link invitation");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Ubah Link Undangn"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <Alert variant="default">
                    Anda hanya memiliki satu kesempatan untuk mengubah link
                    undangan. Setelah diubah, link tidak bisa diganti kembali.
                    Harap pastikan link sudah sesuai.
                  </Alert>
                  <FormControl>
                    <div className="flex w-full items-center overflow-hidden rounded-md border border-input bg-background text-sm shadow-sm h-10">
                      <span className="h-full px-3 flex items-center text-muted-foreground bg-muted border-r border-input select-none">
                        {process.env.NEXT_PUBLIC_BASE_URL}/
                      </span>
                      <Input
                        id={field.name}
                        placeholder="rey-dinda"
                        disabled={loading}
                        {...field}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-full"
                      />
                    </div>
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
                <Save />
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
      <div className="card-dashboard space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Link Undangan</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {isFetching ? (
            <div className="flex-1 bg-slate-100 p-3 rounded-md">
              <div className="h-5 bg-slate-200 rounded animate-pulse" />
            </div>
          ) : (
            <div className="flex-1 bg-gradient-pink-purple p-3 rounded-md text-xs text-slate-800">
              {process.env.NEXT_PUBLIC_BASE_URL}/{initialData?.slug}
            </div>
          )}

          <div className="w-full md:w-auto flex justify-end">
            <Button
              type="button"
              variant="primary"
              className="w-full md:w-auto"
              isFetching={isFetching}
              onClick={() => setIsModalOpen(true)}
            >
              <Link />
              Ubah Link
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingLinkForm;
