"use client";

import { Invitation } from "@/types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import AttendancePieChart from "./attendance-pie-chart";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { SettingService } from "@/lib/services";
import toast from "react-hot-toast";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import DateInput from "@/components/ui/date-input";
import { createRSVPSchema } from "@/lib/schemas/setting";
import useInvitationStore from "@/stores/invitation-store";
import { Alert } from "@/components/ui/alert";

type RsvpFormValues = z.infer<typeof createRSVPSchema>;

interface RSVPFormsProps {
  params: { id: string };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const RSVPForm: React.FC<RSVPFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const updateSettingInInvitation = useInvitationStore(
    (state) => state.updateSettingInInvitation
  );

  const lastSentValues = useRef<RsvpFormValues | null>(null);

  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(createRSVPSchema),
    defaultValues: {
      rsvpEnabled: true,
      rsvpMaxGuests: 1,
      rsvpDeadline: undefined,
      rsvpAllowNote: true,
    },
  });

  const rsvpEnabled = useWatch({ control: form.control, name: "rsvpEnabled" });
  const rsvpMaxGuests = useWatch({
    control: form.control,
    name: "rsvpMaxGuests",
  });
  const rsvpDeadline = useWatch({
    control: form.control,
    name: "rsvpDeadline",
  });
  const rsvpAllowNote = useWatch({
    control: form.control,
    name: "rsvpAllowNote",
  });

  const [debouncedEnabled] = useDebounce(rsvpEnabled, 500);
  const [debouncedGuests] = useDebounce(rsvpMaxGuests, 1000);
  const [debouncedDeadline] = useDebounce(rsvpDeadline, 500);
  const [debouncedAllowNote] = useDebounce(rsvpAllowNote, 500);

  useEffect(() => {
    if (!initialData?.setting) return;

    const fallbackDeadline = (() => {
      const d = new Date(initialData.date);
      d.setDate(d.getDate() - 7);
      return d;
    })();

    const initialValues: RsvpFormValues = {
      rsvpEnabled: initialData.setting.rsvpEnabled ?? true,
      rsvpMaxGuests: initialData.setting.rsvpMaxGuests ?? 1,
      rsvpDeadline: initialData.setting.rsvpDeadline
        ? new Date(initialData.setting.rsvpDeadline)
        : fallbackDeadline,
      rsvpAllowNote: initialData.setting.rsvpAllowNote ?? true,
    };

    form.reset(initialValues);
    lastSentValues.current = initialValues;
  }, [initialData?.setting, initialData?.date, form]);

  useEffect(() => {
    if (!lastSentValues.current) return;
    if (!form.formState.isDirty) return;

    const current: RsvpFormValues = {
      rsvpEnabled: debouncedEnabled,
      rsvpMaxGuests: debouncedGuests,
      rsvpDeadline: debouncedDeadline,
      rsvpAllowNote: debouncedAllowNote,
    };

    const last = lastSentValues.current;

    const isSame =
      last &&
      last.rsvpEnabled === current.rsvpEnabled &&
      last.rsvpMaxGuests === current.rsvpMaxGuests &&
      last.rsvpAllowNote === current.rsvpAllowNote &&
      last.rsvpDeadline?.getTime?.() === current.rsvpDeadline?.getTime?.();

    if (isSame) return;

    lastSentValues.current = current;

    (async () => {
      try {
        const res = await SettingService.updateRSVP(params.id, {
          rsvpEnabled: current.rsvpEnabled,
          rsvpMaxGuests: current.rsvpMaxGuests,
          rsvpDeadline: current.rsvpDeadline || null,
          rsvpAllowNote: current.rsvpAllowNote,
        });

        updateSettingInInvitation(params.id, res.data);
      } catch (error) {
        toast.error("Gagal update RSVP.");
        console.error(error);
      }
    })();
  }, [
    debouncedEnabled,
    debouncedGuests,
    debouncedDeadline,
    debouncedAllowNote,
    params.id,
    updateSettingInInvitation,
    form,
  ]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="space-y-3">
          <Alert>
            Izinkan catatan tambahan untuk tamu menyampaikan pesan tambahan,
            seperti alergi makanan atau keperluan khusus.
          </Alert>
          <Form {...form}>
            <form className="card-dashboard space-y-4">
              <FormField
                control={form.control}
                name="rsvpEnabled"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel htmlFor={field.name} className="font-normal">
                        Fitur RSVP
                      </FormLabel>
                      <FormControl>
                        <Switch
                          id={field.name}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          isFetching={isFetching}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rsvpAllowNote"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel htmlFor={field.name} className="font-normal">
                        Izinkan Catatan Tambahan
                      </FormLabel>
                      <FormControl>
                        <Switch
                          id={field.name}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          isFetching={isFetching}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rsvpMaxGuests"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel htmlFor={field.name} className="font-normal">
                        Max Orang Per Tamu
                      </FormLabel>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            form.setValue(
                              "rsvpMaxGuests",
                              Math.max(1, field.value - 1),
                              {
                                shouldDirty: true,
                              }
                            )
                          }
                          isFetching={isFetching}
                          className="shadow-sm"
                        >
                          <Minus />
                        </Button>
                        <Input
                          id={field.name}
                          type="number"
                          className="text-center w-16"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Math.max(1, Number(e.target.value)))
                          }
                          isFetching={isFetching}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            form.setValue("rsvpMaxGuests", field.value + 1, {
                              shouldDirty: true,
                            })
                          }
                          isFetching={isFetching}
                          className="shadow-sm"
                        >
                          <Plus />
                        </Button>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rsvpDeadline"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-3">
                      <FormLabel htmlFor={field.name} className="font-normal">
                        Batas RSVP
                      </FormLabel>
                      <div>
                        <DateInput
                          id={field.name}
                          className="w-40"
                          isFetching={isFetching}
                          {...field}
                        />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="card-dashboard">
          <AttendancePieChart
            data={initialData?.guests || []}
            isFetching={isFetching}
          />
        </div>
      </div>

      <div className="card-dashboard">
        <DataTable
          columns={columns}
          data={initialData?.guests || []}
          isFecthing={isFetching}
        />
      </div>
    </>
  );
};

export default RSVPForm;
