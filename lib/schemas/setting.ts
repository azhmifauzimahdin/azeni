import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const createRSVPSchema = z.object({
  rsvpEnabled: z.boolean({
    required_error: "Status RSVP wajib diisi",
    invalid_type_error: "Status RSVP harus berupa boolean (ya/tidak)",
  }),
  rsvpMaxGuests: z
    .number({
      required_error: "Jumlah tamu maksimal wajib diisi",
      invalid_type_error: "Jumlah tamu maksimal harus berupa angka",
    })
    .min(0, { message: "Jumlah tamu maksimal minimal 0" }),
  rsvpDeadline: z
    .date({
      required_error: "Tanggal wajib diisi",
      invalid_type_error: "Format tanggal tidak valid",
    })
    .refine((date) => date >= today, {
      message: "Tanggal harus hari ini atau lebih",
    }),
  rsvpAllowNote: z.boolean({
    required_error: "Status catatan tambahan wajib diisi",
    invalid_type_error:
      "Status catatan tambahan harus berupa boolean (ya/tidak)",
  }),
});

export const createApiRSVPSchema = z.object({
  rsvpEnabled: z.boolean({
    required_error: "Status RSVP wajib diisi",
    invalid_type_error: "Status RSVP harus berupa boolean (ya/tidak)",
  }),
  rsvpMaxGuests: z
    .number({
      required_error: "Jumlah tamu maksimal wajib diisi",
      invalid_type_error: "Jumlah tamu maksimal harus berupa angka",
    })
    .min(0, { message: "Jumlah tamu maksimal minimal 0" }),
  rsvpDeadline: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date ? new Date(val) : val,
    z
      .date({
        required_error: "Tanggal wajib diisi",
        invalid_type_error: "Format tanggal tidak valid",
      })
      .refine((date) => date >= today, {
        message: "Tanggal harus hari ini atau lebih",
      })
  ),
  rsvpAllowNote: z.boolean({
    required_error: "Status catatan tambahan wajib diisi",
    invalid_type_error:
      "Status catatan tambahan harus berupa boolean (ya/tidak)",
  }),
});

const allowedPlaceholders = [
  "name",
  "brideName",
  "groomName",
  "invitationLink",
];

export const createWhatsappMessageTemplateSchema = z.object({
  whatsappMessageTemplate: z
    .string()
    .min(10, { message: "Template pesan minimal 10 karakter." })
    .max(5000, { message: "Template terlalu panjang. Maksimal 5000 karakter." })
    .refine(
      (val) => {
        const openBraces = (val.match(/\{\{/g) || []).length;
        const closeBraces = (val.match(/\}\}/g) || []).length;
        return openBraces === closeBraces;
      },
      {
        message: "Jumlah '{{' dan '}}' tidak seimbang.",
      }
    )
    .refine(
      (val) => {
        const placeholderPattern = /\{\{(\w+)\}\}/g;
        const usedPlaceholders: string[] = [];

        let match: RegExpExecArray | null;
        while ((match = placeholderPattern.exec(val)) !== null) {
          usedPlaceholders.push(match[1]);
        }

        return usedPlaceholders.every((name) =>
          allowedPlaceholders.includes(name)
        );
      },
      {
        message: `Hanya placeholder berikut yang diizinkan: ${allowedPlaceholders
          .map((p) => `{{${p}}}`)
          .join(", ")}`,
      }
    ),
});

export const enableInvitationStatusSchema = z.object({
  invitationEnabled: z.boolean({
    required_error: "Status wajib diisi",
    invalid_type_error: "Status harus berupa boolean (ya/tidak)",
  }),
});

export const enableCommentCheckSchema = z.object({
  commentEnabled: z.boolean({
    required_error: "Status wajib diisi",
    invalid_type_error: "Status harus berupa boolean (ya/tidak)",
  }),
  checkinCheckoutEnabled: z.boolean({
    required_error: "Status wajib diisi",
    invalid_type_error: "Status harus berupa boolean (ya/tidak)",
  }),
});

export const scanResetCountdownSecondsSchema = z.object({
  scanResetCountdownSeconds: z
    .number({ invalid_type_error: "Harus berupa angka" })
    .min(0, { message: "Minimal 0 detik" })
    .max(300, { message: "Maksimal 300 detik" }),
});

export const introductionSettingSchema = z.object({
  coupleIntroductionText: z
    .string({
      required_error: "Teks pembuka wajib diisi",
      invalid_type_error: "Teks pembuka harus berupa teks",
    })
    .min(1, { message: "Teks pembuka wajib diisi" })
    .max(255, { message: "Teks pembuka terlalu panjang" }),
  scheduleIntroductionText: z
    .string({
      required_error: "Teks acara wajib diisi",
      invalid_type_error: "Teks acara harus berupa teks",
    })
    .min(1, { message: "Teks acara wajib diisi" })
    .max(255, { message: "Teks acara terlalu panjang" }),
  giftIntroductionText: z
    .string({
      required_error: "Teks kado wajib diisi",
      invalid_type_error: "Teks kado harus berupa teks",
    })
    .min(1, { message: "Teks kado wajib diisi" })
    .max(255, { message: "Teks kado terlalu panjang" }),
  rsvpIntroductionText: z
    .string({
      required_error: "Teks kehadiran wajib diisi",
      invalid_type_error: "Teks kehadiran harus berupa teks",
    })
    .min(1, { message: "Teks kehadiran wajib diisi" })
    .max(255, { message: "Teks kehadiran terlalu panjang" }),
});
