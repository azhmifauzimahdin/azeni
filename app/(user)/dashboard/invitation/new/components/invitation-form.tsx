"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { CircleCheckBig } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/utils/handle-error";
import { Heading } from "@/components/ui/heading";
import { ImageService, InvitationService } from "@/lib/services";
import { InvitationRequest } from "@/types";
import useInvitationStore from "@/stores/invitation-store";
import useUserInvitations from "@/hooks/use-user-invitation";
import axios from "axios";
import ImageUpload from "./image-upload";
import { createInvitationSchema } from "@/lib/schemas/invitation";
import { Alert } from "@/components/ui/alert";
import Stepper from "@/components/ui/stepper";
import useThemes from "@/hooks/use-theme";

interface InvitationFormProps {
  searchParams: { theme_id?: string };
}

const invitationSchema = createInvitationSchema.pick({
  groom: true,
  bride: true,
  slug: true,
  image: true,
});

type InvitationFormValues = z.infer<typeof invitationSchema>;

const InvitationForm: React.FC<InvitationFormProps> = ({ searchParams }) => {
  useUserInvitations();
  useThemes();
  const addInvitationAtFirst = useInvitationStore(
    (state) => state.addInvitationAtFirst
  );
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imageDelete, setImageDelete] = useState<string[]>([]);

  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      groom: "",
      bride: "",
      slug: "",
      image: "",
    },
  });

  const onSubmit = async (data: InvitationFormValues) => {
    try {
      setLoading(true);
      await deleteAllImages();
      const req: InvitationRequest = {
        groom: data.groom,
        bride: data.bride,
        slug: slug,
        themeId: searchParams.theme_id || "",
        image: data.image || "",
        date: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      };
      const res = await InvitationService.createInvitation(req);
      addInvitationAtFirst(res.data);
      router.push(`new/${res.data.id}/checkout`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          router.push(`/dashboard/invitation`);
          toast.error(
            "Anda masih memiliki undangan yang belum diselesaikan atau dibayar."
          );
        } else {
          handleError(error, "invitation");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const onDeleteImage = async (publicId: string) => {
    try {
      setLoading(true);
      await ImageService.deleteImageByPublicId(publicId);
    } catch (error) {
      handleError(error, "image");
    } finally {
      setLoading(false);
    }
  };

  const deleteAllImages = async () => {
    await Promise.all(imageDelete.map((id) => onDeleteImage(id)));
    setImageDelete([]);
  };

  const groom = form.watch("groom");
  const bride = form.watch("bride");
  const slug = form.watch("slug");

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  useEffect(() => {
    const combined = `${groom || ""} ${bride || ""}`;
    form.setValue("slug", generateSlug(combined));
  }, [bride, groom, form]);

  return (
    <>
      <Heading
        title="Buat Undangan"
        description="Buat undanganmu sekarang juga"
      />
      <Stepper currentStep={1} />

      <Alert variant="default">
        Pastikan nama panggilan mempelai pria dan wanita sudah benar, termasuk
        penggunaan huruf besar. Nama tidak dapat diubah setelah disimpan dan
        akan digunakan di beberapa bagian undangan secara otomatis. Undangan
        aktif selama <span className="font-bold">6 bulan</span> dimulai sejak
        tanggal dibuat.
      </Alert>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 card-dashboard"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                      placeholder="Nama panggilan pria"
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
              name="bride"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Wanita
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="Nama panggilan wanita"
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabelText required>Foto</FormLabelText>
                  <FormControl>
                    <ImageUpload
                      id={field.name}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={(publicId) => {
                        setImageDelete((prev) => [...prev, publicId]);
                        field.onChange("");
                      }}
                      value={field.value || ""}
                      path="users/invitations"
                    />
                  </FormControl>
                  <FormDescription>Foto digunakan untuk cover</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-1 md:col-span-3">
              <div className="bg-gradient-pink-purple p-3 rounded-md text-xs text-slate-800">
                <span className="font-medium pe-1">Link undangan : </span>
                {process.env.NEXT_PUBLIC_BASE_URL}/{slug}-
                <span className="italic">{"{kodeunik}"}</span>
              </div>
              <FormDescription>
                ** Kode unik terbentuk otomatis jika link undangan sudah
                terpakai pengguna lain
              </FormDescription>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-end gap-3">
            <Button
              variant="primary"
              isLoading={loading}
              className="w-full md:w-auto"
              type="submit"
            >
              <CircleCheckBig /> Buat Undangan
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default InvitationForm;
