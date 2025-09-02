"use client";

import { Alert } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { enableCommentCheckSchema } from "@/lib/schemas/setting";
import { SettingService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import useInvitationStore from "@/stores/invitation-store";
import { Invitation } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type SettingEnableFormValues = z.infer<typeof enableCommentCheckSchema>;

interface SettingEnableFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const SettingEnableForm: React.FC<SettingEnableFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const updateSettingInInvitation = useInvitationStore(
    (state) => state.updateSettingInInvitation
  );

  const form = useForm<SettingEnableFormValues>({
    resolver: zodResolver(enableCommentCheckSchema),
    defaultValues: {
      commentEnabled: true,
      checkinCheckoutEnabled: true,
    },
  });

  useEffect(() => {
    if (initialData?.setting) {
      form.reset({
        commentEnabled: initialData.setting.commentEnabled,
        checkinCheckoutEnabled: initialData.setting.checkinCheckoutEnabled,
      });
    }
  }, [initialData, form]);

  const handleToggleCommentChange = async (checked: boolean) => {
    form.setValue("commentEnabled", checked);
    const isValid = await form.trigger("commentEnabled");
    if (isValid) {
      form.handleSubmit((data) => onSubmit(data, true))();
    }
  };

  const handleToggleCheckChange = async (checked: boolean) => {
    form.setValue("checkinCheckoutEnabled", checked);
    const isValid = await form.trigger("checkinCheckoutEnabled");
    if (isValid) {
      form.handleSubmit((data) => onSubmit(data, true))();
    }
  };

  const onSubmit = async (data: SettingEnableFormValues, silent = false) => {
    try {
      const res = await SettingService.updateCommentCheckStatus(
        params.id,
        data
      );
      updateSettingInInvitation(params.id, res.data);

      if (!silent) toast.success("Pengaturan berhasil disimpan.");
    } catch (error: unknown) {
      handleError(error, "enable comment check");
    }
  };

  return (
    <Form {...form}>
      <form
        className="card-dashboard space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <Alert variant="default">
          Hapus ucapan & doa hanya tersedia untuk pemilik undangan.
        </Alert>
        <div className="flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <Label htmlFor="auto-date" className="text-base font-medium">
              ucapan & doa di undangan
            </Label>
            <p className="text-xs text-muted-foreground">
              Aktifkan fitur ini agar tamu bisa menulis ucapan & doa di
              undangan. Nonaktifkan jika tidak ingin ditampilkan.
            </p>
          </div>
          <FormField
            control={form.control}
            name="commentEnabled"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormControl>
                    <Switch
                      id={field.name}
                      checked={field.value}
                      onCheckedChange={handleToggleCommentChange}
                      isFetching={isFetching}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <Label htmlFor="auto-date" className="text-base font-medium">
              QR Check-in & Check-out
            </Label>
            <p className="text-xs text-muted-foreground">
              Aktifkan fitur ini untuk menampilkan QR Code check-in dan
              check-out pada undangan. Nonaktifkan jika tidak diperlukan.
            </p>
          </div>
          <FormField
            control={form.control}
            name="checkinCheckoutEnabled"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormControl>
                    <Switch
                      id={field.name}
                      checked={field.value}
                      onCheckedChange={handleToggleCheckChange}
                      isFetching={isFetching}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default SettingEnableForm;
