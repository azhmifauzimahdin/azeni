"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { InvitationService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import useAdminInvitationStore from "@/stores/admin-invitation-store";
import { Invitation } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export const deleteInvitationSchema = (expectedSlug: string) =>
  z.object({
    slug: z
      .string()
      .min(1, { message: "Slug harus diisi" })
      .refine((value) => value === expectedSlug, {
        message: "Slug tidak cocok. Pastikan slug yang dimasukkan benar.",
      }),
  });

export type DeleteInvitationSchema = z.infer<
  ReturnType<typeof deleteInvitationSchema>
>;

interface SettingLinkFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const Settingform: React.FC<SettingLinkFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteInvitationById = useAdminInvitationStore(
    (state) => state.deleteInvitationById
  );

  const form = useForm<DeleteInvitationSchema>({
    resolver: zodResolver(deleteInvitationSchema(initialData?.slug || "")),
    defaultValues: {
      slug: "",
    },
  });

  const onSubmit = async () => {
    try {
      setLoading(true);
      const res = await InvitationService.deleteInvitationById(params.id);
      deleteInvitationById(res.data.id);
      setIsModalOpen(false);
      router.push(`/dashboard/invitation`);
      toast.success("Undangan berhasil dihapus.");
    } catch (error: unknown) {
      handleError(error, "link invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Hapus Undangan"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          form.reset();
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Alert variant="destructive">
              Menghapus undangan ini akan menghapus semua data terkait seperti
              tamu, cerita, galeri, komentar, dan lainnya. Tindakan ini tidak
              dapat dibatalkan.
            </Alert>

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ketik ulang slug undangan&nbsp;
                    <strong className="text-foreground">
                      {initialData?.slug}
                    </strong>{" "}
                    untuk mengonfirmasi.
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Masukkan ulang slug undangan"
                      disabled={loading}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  form.reset();
                }}
                className="w-full md:w-auto"
              >
                <X />
                Batal
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="w-full md:w-auto"
                disabled={form.watch("slug") !== initialData?.slug}
                isLoading={loading}
              >
                <Trash2 />
                Hapus Undangan
              </Button>
            </div>
          </form>
        </Form>
      </Modal>

      <div className="card-dashboard space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Hapus Undangan</h2>
        <p>
          Menghapus undangan akan menghapus semua data terkait seperti tamu,
          cerita, galeri, dan lainnya. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="w-full md:w-auto flex justify-end">
          <Button
            type="button"
            variant="destructive"
            className="w-full md:w-auto"
            isFetching={isFetching}
            onClick={() => setIsModalOpen(true)}
          >
            <Trash2 />
            Hapus Undangan
          </Button>
        </div>
      </div>
    </>
  );
};

export default Settingform;
