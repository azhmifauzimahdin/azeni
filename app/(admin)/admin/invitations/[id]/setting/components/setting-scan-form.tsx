"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { scanResetCountdownSecondsSchema } from "@/lib/schemas/setting";
import { SettingService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import useAdminInvitationStore from "@/stores/admin-invitation-store";
import { Invitation } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { z } from "zod";

type SettingLinkFormValues = z.infer<typeof scanResetCountdownSecondsSchema>;

interface SettingScanFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const SettingScanForm: React.FC<SettingScanFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const updateSettingInInvitation = useAdminInvitationStore(
    (state) => state.updateSettingInInvitation
  );

  const form = useForm<SettingLinkFormValues>({
    resolver: zodResolver(scanResetCountdownSecondsSchema),
    defaultValues: {
      scanResetCountdownSeconds: 1,
    },
    mode: "onChange",
  });

  const { watch, formState, reset } = form;
  const values = watch();
  const [debouncedValues] = useDebounce(values, 1000);

  const [hasInteracted, setHasInteracted] = useState(false);
  const initialValueRef = useRef<number | null>(null);

  useEffect(() => {
    const newVal = initialData?.setting?.scanResetCountdownSeconds;

    if (typeof newVal === "number" && newVal !== initialValueRef.current) {
      initialValueRef.current = newVal;
      reset({ scanResetCountdownSeconds: newVal });
    }
  }, [initialData?.setting?.scanResetCountdownSeconds, reset]);

  useEffect(() => {
    const val = debouncedValues.scanResetCountdownSeconds;
    const initial = initialValueRef.current;

    if (!hasInteracted) return;
    if (!formState.isValid) return;
    if (typeof initial !== "number" || val === initial) return;

    const save = async () => {
      try {
        const res =
          await SettingService.updateInvitationScanResetCountdownSeconds(
            params.id,
            { scanResetCountdownSeconds: val }
          );
        updateSettingInInvitation(params.id, res.data);
        initialValueRef.current = val;
      } catch (error) {
        handleError(error);
      }
    };

    save();
  }, [
    debouncedValues.scanResetCountdownSeconds,
    formState.isValid,
    hasInteracted,
    params.id,
    updateSettingInInvitation,
  ]);

  return (
    <Form {...form}>
      <form
        className="card-dashboard space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="text-xl font-semibold text-slate-800">
          Pengaturan Scan Undangan
        </h2>
        <p>Atur berapa detik sebelum halaman scan undangan menutup otomatis.</p>

        <FormField
          control={form.control}
          name="scanResetCountdownSeconds"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setHasInteracted(true);
                    field.onChange(Math.max(field.value - 1, 0));
                  }}
                  disabled={field.value <= 0}
                  isFetching={isFetching}
                >
                  <Minus />
                </Button>

                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={300}
                    value={field.value}
                    onChange={(e) => {
                      setHasInteracted(true);
                      field.onChange(Number(e.target.value));
                    }}
                    className="w-16 text-center"
                    isFetching={isFetching}
                  />
                </FormControl>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setHasInteracted(true);
                    field.onChange(field.value + 1);
                  }}
                  isFetching={isFetching}
                >
                  <Plus />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SettingScanForm;
