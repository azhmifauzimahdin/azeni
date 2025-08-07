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
import { createWhatsappMessageTemplateSchema } from "@/lib/schemas/setting";
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

type WhatsappMessageTemplateFormValues = z.infer<
  typeof createWhatsappMessageTemplateSchema
>;

interface SettingTemplateFormsProps {
  params: { id: string };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

function renderTemplate(
  template: string,
  vars: Record<string, string>
): React.ReactNode[] {
  const raw = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = vars[key] ?? "";
    if (key === "invitationLink") {
      return `[[INVITATION_LINK]]`;
    }
    return val;
  });

  const parts = raw.split(/(\*[^\*]+\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      const inner = part
        .slice(1, -1)
        .replace("[[INVITATION_LINK]]", vars.invitationLink);
      return (
        <strong key={i} className="font-semibold">
          {inner}
        </strong>
      );
    }

    if (part.includes("[[INVITATION_LINK]]")) {
      const segments = part.split("[[INVITATION_LINK]]");
      return (
        <span key={i}>
          {segments[0]}
          <a
            href={vars.invitationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {vars.invitationLink}
          </a>
          {segments[1]}
        </span>
      );
    }

    return <span key={i}>{part}</span>;
  });
}

const SettingTemplateForm: React.FC<SettingTemplateFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const updateSettingInInvitation = useAdminInvitationStore(
    (state) => state.updateSettingInInvitation
  );

  const form = useForm<WhatsappMessageTemplateFormValues>({
    resolver: zodResolver(createWhatsappMessageTemplateSchema),
    defaultValues: {
      whatsappMessageTemplate: "Assalamu'alaikum warahmatullahi wabarakatuh",
    },
  });

  useEffect(() => {
    form.reset({
      whatsappMessageTemplate:
        initialData?.setting?.whatsappMessageTemplate ?? "",
    });
  }, [initialData, form]);

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: WhatsappMessageTemplateFormValues) => {
    try {
      setLoading(true);
      const res = await SettingService.updateWaTemplate(params.id, data);
      updateSettingInInvitation(params.id, res.data);
      toast.success("Template berhasil diperbarui");
    } catch (error) {
      handleError(error, "wa template");
    } finally {
      setLoading(false);
    }
  };

  const preview = renderTemplate(form.watch("whatsappMessageTemplate"), {
    name: "Azhmi Fauzi Mahdin",
    brideName: initialData?.groom || "undefined",
    groomName: initialData?.bride || "undefined",
    invitationLink: `${process.env.NEXT_PUBLIC_BASE_URL}/${initialData?.slug}`,
  });

  return (
    <div className="space-y-4 card-dashboard">
      <h2 className="text-xl font-semibold text-slate-800">
        Format Pesan WhatsApp
      </h2>
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="whatsappMessageTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-base">
                      Isi Pesan
                    </FormLabel>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div>
                        <span className="inline-block bg-muted text-foreground text-xs font-mono font-medium px-2 py-0.5 rounded-md">
                          {"{{name}}"}
                        </span>{" "}
                        : Nama tamu
                      </div>
                      <div>
                        <span className="inline-block bg-muted text-foreground text-xs font-mono font-medium px-2 py-0.5 rounded-md">
                          {"{{brideName}}"}
                        </span>{" "}
                        : Nama mempelai wanita
                      </div>
                      <div>
                        <span className="inline-block bg-muted text-foreground text-xs font-mono font-medium px-2 py-0.5 rounded-md">
                          {"{{groomName}}"}
                        </span>{" "}
                        : Nama mempelai pria
                      </div>
                      <div>
                        <span className="inline-block bg-muted text-foreground text-xs font-mono font-medium px-2 py-0.5 rounded-md">
                          {"{{invitationLink}}"}
                        </span>{" "}
                        : Tautan undangan digital
                      </div>
                    </div>
                    <FormControl>
                      <Textarea
                        className="min-h-[400px]"
                        disabled={loading}
                        isFetching={isFetching}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col md:flex-row items-center justify-end gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full md:w-auto"
                  disabled={loading}
                  isFetching={isFetching}
                >
                  <Save />
                  Simpan Template
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="space-y-2">
          <h2 className="font-medium text-base">Preview Pesan</h2>
          {isFetching ? (
            <div className="p-4 bg-muted/50 border rounded-md text-sm min-h-[600px]">
              <div className="bg-slate-100 p-3 rounded-xl space-y-3 animate-pulse h-full flex flex-col justify-start">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 bg-slate-300 rounded w-3/4" />
                    <div className="h-4 bg-slate-300 rounded w-1/2" />
                    <div className="h-4 bg-slate-300 rounded w-full" />
                    <div className="h-4 bg-slate-300 rounded w-[60%]" />
                    <div className="h-4 bg-slate-300 rounded w-2/3" />
                    <div className="h-4 bg-slate-300 rounded w-1/3" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted/50 border rounded-md text-sm h-full whitespace-pre-line">
              <div className="bg-green-100 text-green-900 p-3 rounded-xl">
                {preview}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingTemplateForm;
