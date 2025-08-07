"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { introductionSettingSchema } from "@/lib/schemas/setting";
import { SettingService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import useAdminInvitationStore from "@/stores/admin-invitation-store";
import { Invitation } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type IntroductionSettingFormValues = z.infer<typeof introductionSettingSchema>;

interface SettingIntroductionFormsProps {
  params: { id: string };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const SettingIntroductionForm: React.FC<SettingIntroductionFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const updateSettingInInvitation = useAdminInvitationStore(
    (state) => state.updateSettingInInvitation
  );

  const form = useForm<IntroductionSettingFormValues>({
    resolver: zodResolver(introductionSettingSchema),
    defaultValues: {
      coupleIntroductionText:
        "Dengan memohon rahmat dan ridha Allah SWT, Kami bermaksud menyelenggarakan acara pernikahan putra-putri kami",
      scheduleIntroductionText: "Yang Insyaallah akan diselenggarakan pada",
      giftIntroductionText:
        "Doa restu Bapak/Ibu/Saudara/i sudah merupakan hadiah terbaik bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.",
      rsvpIntroductionText:
        "Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan doa restu kepada kami.",
    },
  });

  useEffect(() => {
    form.reset({
      coupleIntroductionText:
        initialData?.setting?.coupleIntroductionText ?? "",
      scheduleIntroductionText:
        initialData?.setting?.scheduleIntroductionText ?? "",
      giftIntroductionText: initialData?.setting?.giftIntroductionText ?? "",
      rsvpIntroductionText: initialData?.setting?.rsvpIntroductionText ?? "",
    });
  }, [initialData, form]);

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: IntroductionSettingFormValues) => {
    try {
      setLoading(true);
      const res = await SettingService.updateIntroductionText(params.id, data);
      updateSettingInInvitation(params.id, res.data);
      toast.success("Teks undangan berhasil diperbarui");
    } catch (error) {
      handleError(error, "Teks undangan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 card-dashboard">
      <h2 className="text-xl font-semibold text-slate-800">Teks Undangan</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="coupleIntroductionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Teks Pembuka</FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      disabled={loading}
                      isFetching={isFetching}
                      className="h-44"
                      placeholder="Dengan memohon rahmat dan ridha Allah SWT, Kami bermaksud menyelenggarakan acara pernikahan putra-putri kami"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduleIntroductionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Teks Acara</FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      disabled={loading}
                      isFetching={isFetching}
                      className="h-44"
                      placeholder="Yang Insyaallah akan diselenggarakan pada"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="giftIntroductionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Teks Kado</FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      disabled={loading}
                      isFetching={isFetching}
                      className="h-44"
                      placeholder="Doa restu Bapak/Ibu/Saudara/i sudah merupakan hadiah terbaik bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rsvpIntroductionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Teks RSVP</FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      disabled={loading}
                      isFetching={isFetching}
                      className="h-44"
                      placeholder="Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan doa restu kepada kami."
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
              isLoading={loading}
              className="w-full md:w-auto"
              type="submit"
            >
              <Save /> Simpan Teks Undangan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SettingIntroductionForm;
