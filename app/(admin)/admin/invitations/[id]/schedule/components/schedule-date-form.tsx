"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateDateInvitationSchema } from "@/lib/schemas/invitation";
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
import { InvitationService } from "@/lib/services";
import toast from "react-hot-toast";
import { handleError } from "@/lib/utils/handle-error";
import useAdminInvitationStore from "@/stores/admin-invitation-store";

type ScheduleDateFormValues = z.infer<typeof updateDateInvitationSchema>;

interface ScheduleDateFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const ScheduleDateForm: React.FC<ScheduleDateFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const [loading, setLoading] = useState(false);

  const updateDateInInvitation = useAdminInvitationStore(
    (state) => state.updateDateInInvitation
  );

  const form = useForm<ScheduleDateFormValues>({
    resolver: zodResolver(updateDateInvitationSchema),
    defaultValues: {
      useScheduleDate: true,
      date: new Date(),
    },
  });

  useEffect(() => {
    if (initialData?.date) {
      form.reset({
        useScheduleDate: initialData.useScheduleDate,
        date: new Date(initialData.date),
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: ScheduleDateFormValues, silent = false) => {
    try {
      if (!silent) setLoading(true);

      const res = await InvitationService.updateDateByUserId(params.id, data);
      updateDateInInvitation(
        params.id,
        res.data.date,
        res.data.useScheduleDate
      );

      if (!silent) toast.success("Tanggal berhasil disimpan.");
    } catch (error: unknown) {
      handleError(error, "date");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleToggleChange = async (checked: boolean) => {
    form.setValue("useScheduleDate", checked);
    const isValid = await form.trigger("useScheduleDate");
    if (isValid) {
      form.handleSubmit((data) => onSubmit(data, true))();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
        <div className="mb-6 p-4 space-y-2 bg-white rounded-md shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1 pr-4">
              <Label htmlFor="auto-date" className="text-base font-medium">
                Tanggal hitung mundur otomatis
              </Label>
              <p className="text-xs text-muted-foreground">
                Tanggal akan diambil otomatis dari jadwal pertama dan digunakan
                untuk tampilan cover serta hitung mundur. Nonaktifkan untuk atur
                manual.
              </p>
            </div>
            <FormField
              control={form.control}
              name="useScheduleDate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormControl>
                      <Switch
                        id={field.name}
                        checked={field.value}
                        onCheckedChange={handleToggleChange}
                        isFetching={isFetching}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {!form.watch("useScheduleDate") && (
            <>
              <Separator />
              <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-[300px]">
                      <FormLabel htmlFor={field.name}>Tanggal</FormLabel>
                      <FormControl>
                        <DateTimeInput
                          id={field.name}
                          disabled={loading}
                          isFetching={isFetching}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  variant="primary"
                  isLoading={loading}
                  className="w-full md:w-auto"
                  type="submit"
                  isFetching={isFetching}
                >
                  <Save />
                  Simpan
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ScheduleDateForm;
