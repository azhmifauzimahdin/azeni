"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, BadgeCheck, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Invitation } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { createRsvpSchema } from "@/lib/schemas/rsvp";

interface RSVPProps {
  invitation: Invitation;
  onSubmit: (data: RSVPFormValues) => Promise<void>;
  isLoading: boolean;
  buttonClassName?: string;
}

export type RSVPFormValues = z.infer<ReturnType<typeof createRsvpSchema>>;

const RSVP: React.FC<RSVPProps> = ({
  invitation,
  onSubmit,
  isLoading,
  buttonClassName = "bg-green-primary hover:bg-green-secondary",
}) => {
  const form = useForm<RSVPFormValues>({
    resolver: zodResolver(
      createRsvpSchema(invitation.setting?.rsvpMaxGuests ?? 5)
    ),
    defaultValues: {
      isAttending: true,
      totalGuests: 1,
      notes: "",
    },
  });

  const isAttending = form.watch("isAttending");

  const handleFormSubmit = async (data: RSVPFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  const rsvpDeadline = invitation.setting?.rsvpDeadline
    ? new Date(invitation.setting.rsvpDeadline)
    : null;

  const now = new Date();

  const isDeadlinePassed = rsvpDeadline && now > rsvpDeadline;
  const hasRSVPed =
    invitation.guest.isAttending || invitation.guest.totalGuests > 1;

  return (
    <section>
      {rsvpDeadline && !hasRSVPed && (
        <p
          className="text-center text-sm text-muted-foreground mb-4"
          data-aos="fade-down"
        >
          Batas akhir RSVP:&nbsp;
          <strong>
            {rsvpDeadline.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </strong>
        </p>
      )}

      {isDeadlinePassed && !hasRSVPed ? (
        <div
          className="text-center mt-8 flex flex-col items-center gap-4"
          data-aos="zoom-in"
        >
          <XCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-semibold">RSVP Telah Ditutup</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Maaf, batas waktu RSVP telah lewat. Silakan hubungi kami langsung
            jika ada perubahan.
          </p>
        </div>
      ) : !hasRSVPed ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
            data-aos="fade-up"
          >
            <div
              className="flex justify-center gap-6"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <button
                type="button"
                onClick={() => form.setValue("isAttending", true)}
                className={cn(
                  "group w-full sm:w-44 h-36 border rounded-xl shadow transition-all duration-200",
                  "flex flex-col items-center justify-center gap-2 text-center bg-white dark:bg-background",
                  isAttending
                    ? "border-green-500 ring-2 ring-green-500 text-green-600"
                    : "border-muted hover:ring-1 hover:ring-green-500 "
                )}
              >
                <CheckCircle2 className="w-8 h-8 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-base font-medium">Hadir</span>
              </button>

              <button
                type="button"
                onClick={() => form.setValue("isAttending", false)}
                className={cn(
                  "group w-full sm:w-44 h-36 border rounded-xl shadow transition-all duration-200",
                  "flex flex-col items-center justify-center gap-2 text-center bg-white dark:bg-background",
                  !isAttending
                    ? "border-red-500 ring-2 ring-red-500 text-red-600"
                    : "border-muted hover:ring-1 hover:ring-red-500 "
                )}
              >
                <XCircle className="w-8 h-8 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-base font-medium">Tidak Hadir</span>
              </button>
            </div>

            {isAttending && (
              <div
                className="spacey-y-4"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                <FormField
                  control={form.control}
                  name="totalGuests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block mb-2 text-sm ">
                        Jumlah Orang (Maks. {invitation.setting?.rsvpMaxGuests}
                        &nbsp; Orang)
                      </FormLabel>
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            form.setValue(
                              "totalGuests",
                              Math.max(1, field.value - 1),
                              {
                                shouldDirty: true,
                              }
                            )
                          }
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
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            form.setValue("totalGuests", field.value + 1, {
                              shouldDirty: true,
                            })
                          }
                          className="shadow-sm"
                        >
                          <Plus />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {invitation.setting?.rsvpAllowNote && (
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block mb-2 text-sm ">
                          Catatan (Opsional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Contoh: Saya akan datang lebih malam..."
                            className="h-32 bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            <div
              className="text-center pt-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Button
                type="submit"
                className={cn("w-full", buttonClassName)}
                disabled={isLoading}
                isLoading={isLoading}
              >
                Kirim RSVP
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div
          className="text-center mt-8 flex flex-col items-center gap-4"
          data-aos="zoom-in"
        >
          <BadgeCheck className="w-12 h-12 text-green-500" />
          <h3 className="text-xl font-semibold">
            {invitation.guest.isAttending ? "RSVP Diterima" : "Terima Kasih"}
          </h3>
          <p className="text-sm max-w-md">
            {invitation.guest.isAttending
              ? `Kami sangat senang Anda akan hadir bersama ${invitation.guest.totalGuests} orang. Sampai jumpa di hari bahagia kami!`
              : "Terima kasih telah mengonfirmasi. Semoga doa dan restu Anda tetap menyertai kami dari jauh."}
          </p>
          {invitation.guest.notes && (
            <p className="text-sm italic max-w-md">
              Catatan Anda: “{invitation.guest.notes}”
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default RSVP;
