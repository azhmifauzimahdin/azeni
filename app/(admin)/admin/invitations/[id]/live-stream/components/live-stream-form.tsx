"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { Invitation } from "@/types";
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
import DateTimeInput from "@/components/ui/date-time-input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { LiveStreamService } from "@/lib/services";
import toast from "react-hot-toast";
import { handleError } from "@/lib/utils/handle-error";
import { createLiveStreamSchema } from "@/lib/schemas/live-stream";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAdminInvitationStore from "@/stores/admin-invitation-store";
import { Alert } from "@/components/ui/alert";

type LiveStreamFormValues = z.infer<typeof createLiveStreamSchema>;

interface LiveStreamFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const LiveStreamForm: React.FC<LiveStreamFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const [loading, setLoading] = useState(false);

  const updateLiveStreamInInvitation = useAdminInvitationStore(
    (state) => state.updateLiveStreamInInvitation
  );

  const form = useForm<LiveStreamFormValues>({
    resolver: zodResolver(createLiveStreamSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      description: "",
      urlYoutube: "",
      urlInstagram: "",
      urlTiktok: "",
      urlZoom: "",
      urlFacebook: "",
      urlCustom: "",
    },
  });

  useEffect(() => {
    if (initialData?.liveStream) {
      form.reset({
        startDate: new Date(
          initialData.liveStream.startDate || new Date().getTime()
        ),
        endDate: new Date(
          initialData.liveStream.endDate || new Date().getTime()
        ),
        description: initialData.liveStream.description,
        urlYoutube: initialData.liveStream.urlYoutube,
        urlInstagram: initialData.liveStream.urlInstagram,
        urlTiktok: initialData.liveStream.urlTiktok,
        urlZoom: initialData.liveStream.urlZoom,
        urlFacebook: initialData.liveStream.urlFacebook,
        urlCustom: initialData.liveStream.urlCustom,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: LiveStreamFormValues) => {
    try {
      setLoading(true);
      const res = await LiveStreamService.upsertLiveStream(params.id, data);
      updateLiveStreamInInvitation(params.id, res.data);
      toast.success("Data streaming berhasil disimpan.");
    } catch (error: unknown) {
      console.log(error);
      handleError(error, "streaming");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Alert className="mb-4">
        Fitur Live Streaming pada undangan akan otomatis muncul apabila salah
        satu link terisi.
      </Alert>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 card-dashboard"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Tanggal Mulai
                  </FormLabel>
                  <FormControl>
                    <DateTimeInput
                      id={field.name}
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
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Tanggal Selesai
                  </FormLabel>
                  <FormControl>
                    <DateTimeInput
                      id={field.name}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      placeholder="Live streaming acara akad nikah"
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
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="urlYoutube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Link Youtube</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="https://www.youtube.com/watch?v=example"
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
              name="urlInstagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Link Instagram</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="https://www.facebook.com/example"
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
              name="urlTiktok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Link Tiktok</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="https://www.tiktok.com/@example"
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
              name="urlZoom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Link Zoom</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="https://zoom.us/j/1234567890"
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
              name="urlFacebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Link Facebook</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="https://www.facebook.com/live"
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
              name="urlCustom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Link Custom</FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      placeholder="https://www.example.com/live"
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

export default LiveStreamForm;
