"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
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
import toast from "react-hot-toast";
import { CoupleService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import { Invitation } from "@/types";
import ImageUpload from "./image-upload";
import { Input } from "@/components/ui/input";
import { getFolderFromInvitationId } from "@/lib/utils/get-folder-from-invitation-id";
import { createCoupleSchema } from "@/lib/schemas/couple";
import useAdminInvitationStore from "@/stores/admin-invitation-store";
import { cn } from "@/lib/utils";

type CoupleFormValues = z.infer<typeof createCoupleSchema>;

interface CoupleFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const CoupleForm: React.FC<CoupleFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const needsPhoto = !initialData?.theme?.category.name.includes("Tanpa Foto");
  const [loading, setLoading] = useState(false);
  const [loadingUploadGroomImage, setLoadingUploadGroomImage] = useState(false);
  const [loadingUploadBrideImage, setLoadingUploadBrideImage] = useState(false);
  const [loadingDeleteGroomImage, setLoadingDeleteGroomImage] = useState(false);
  const [loadingDeleteBrideImage, setLoadingDeleteBrideImage] = useState(false);
  const [groomImage, setGroomImage] = useState<string>("");
  const [brideImage, setBrideImage] = useState<string>("");

  const updateCoupleInInvitation = useAdminInvitationStore(
    (state) => state.updateCoupleInInvitation
  );
  const updateCoupleImageInInvitation = useAdminInvitationStore(
    (state) => state.updateCoupleImageInInvitation
  );

  const form = useForm<CoupleFormValues>({
    resolver: zodResolver(createCoupleSchema),
    defaultValues: initialData?.couple
      ? {
          groomName: initialData.couple.groomName,
          groomFather: initialData.couple.groomFather,
          groomMother: initialData.couple.groomMother,
          groomInstagram: initialData.couple.groomInstagram,
          brideName: initialData.couple.brideName,
          brideFather: initialData.couple.brideFather,
          brideMother: initialData.couple.brideMother,
          brideInstagram: initialData.couple.brideInstagram,
        }
      : {
          groomName: "",
          groomFather: "",
          groomMother: "",
          groomInstagram: "",
          brideName: "",
          brideFather: "",
          brideMother: "",
          brideInstagram: "",
        },
  });

  useEffect(() => {
    if (initialData?.couple) {
      form.reset({
        groomName: initialData.couple.groomName,
        groomFather: initialData.couple.groomFather,
        groomMother: initialData.couple.groomMother,
        groomInstagram: initialData.couple.groomInstagram,
        brideName: initialData.couple.brideName,
        brideFather: initialData.couple.brideFather,
        brideMother: initialData.couple.brideMother,
        brideInstagram: initialData.couple.brideInstagram,
      });
      setGroomImage(initialData.couple.groomImage);
      setBrideImage(initialData.couple.brideImage);
    }
  }, [initialData, form]);

  const handleSubmit = async (data: CoupleFormValues) => {
    try {
      setLoading(true);
      const res = await CoupleService.createCouple(params.id, data);
      updateCoupleInInvitation(params.id, res.data);
      toast.success("Data pengantin berhasil disimpan.");
    } catch (error: unknown) {
      console.log(error);
      handleError(error, "couple");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (
    field: "groomImage" | "brideImage",
    url: string
  ) => {
    try {
      if (field === "groomImage") setLoadingUploadGroomImage(true);
      else setLoadingUploadBrideImage(true);
      await CoupleService.updateCoupleImage(params.id, {
        field,
        url,
      });
      updateCoupleImageInInvitation(params.id, field, url);
      toast.success("Foto berhasil disimpan.");
    } catch (error: unknown) {
      handleError(error, "image");
    } finally {
      if (field === "groomImage") setLoadingUploadGroomImage(false);
      else setLoadingUploadBrideImage(false);
    }
  };

  const handleDeleteImage = async (field: "groomImage" | "brideImage") => {
    try {
      if (field === "groomImage") {
        setLoadingDeleteGroomImage(true);
        await CoupleService.deleteCoupleImage(params.id, "groomImage");
        updateCoupleImageInInvitation(params.id, "groomImage", "");
      } else {
        setLoadingDeleteBrideImage(true);
        await CoupleService.deleteCoupleImage(params.id, "brideImage");
        updateCoupleImageInInvitation(params.id, "brideImage", "");
      }
      toast.success("Foto berhasil dihapus.");
    } catch (error) {
      console.log(error);
      handleError(error, "image");
    } finally {
      if (field === "groomImage") setLoadingDeleteGroomImage(false);
      else setLoadingDeleteBrideImage(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 card-dashboard"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {needsPhoto && (
              <div>
                <ImageUpload
                  isLoadingUpload={loadingUploadGroomImage}
                  isLoadingDelete={loadingDeleteGroomImage}
                  disabled={loading}
                  onChange={(url) => {
                    handleUploadImage("groomImage", url);
                    setGroomImage(url);
                  }}
                  onRemove={() => handleDeleteImage("groomImage")}
                  path={`users/couples/${getFolderFromInvitationId(params.id)}`}
                  value={groomImage}
                  defaultValue="/assets/img/default-groom.png"
                  isFetching={isFetching}
                />
              </div>
            )}
            <div
              className={cn(
                "space-y-4",
                needsPhoto ? "md:col-span-3" : "md:col-span-4"
              )}
            >
              <FormField
                control={form.control}
                name="groomName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required htmlFor={field.name}>
                      Mempelai Pria
                    </FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="Azhmi Fauzi"
                        disabled={loading}
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
                name="groomFather"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required htmlFor={field.name}>
                      Ayah
                    </FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="H. Ahmad Subekti"
                        disabled={loading}
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
                name="groomMother"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required htmlFor={field.name}>
                      Ibu
                    </FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="Hj. Siti Maemunah"
                        disabled={loading}
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
                name="groomInstagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Link Instagram</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="https://www.instagram.com/azen.inv/"
                        disabled={loading}
                        isFetching={isFetching}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {needsPhoto && (
              <div>
                <ImageUpload
                  isLoadingUpload={loadingUploadBrideImage}
                  isLoadingDelete={loadingDeleteBrideImage}
                  disabled={loading}
                  onChange={(url) => {
                    handleUploadImage("brideImage", url);
                    setBrideImage(url);
                  }}
                  onRemove={() => handleDeleteImage("brideImage")}
                  path={`couple/${getFolderFromInvitationId(params.id)}`}
                  value={brideImage}
                  defaultValue="/assets/img/default-bride.png"
                  isFetching={isFetching}
                />
              </div>
            )}
            <div
              className={cn(
                "space-y-4",
                needsPhoto ? "md:col-span-3" : "md:col-span-4"
              )}
            >
              <FormField
                control={form.control}
                name="brideName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required htmlFor={field.name}>
                      Mempelai Wanita
                    </FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="Anisa Putri Lestari"
                        disabled={loading}
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
                name="brideFather"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required htmlFor={field.name}>
                      Ayah
                    </FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="Drs. H. Bambang Santosa"
                        disabled={loading}
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
                name="brideMother"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required htmlFor={field.name}>
                      Ibu
                    </FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="Hj. Nur Aini"
                        disabled={loading}
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
                name="brideInstagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Link Instagram</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="https://www.instagram.com/azen.inv/"
                        disabled={loading}
                        isFetching={isFetching}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button
              variant="primary"
              isLoading={loading}
              disabled={loading}
              className="w-full md:w-auto md:order-2"
              type="submit"
              isFetching={isFetching}
            >
              <Save /> Simpan
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default CoupleForm;
