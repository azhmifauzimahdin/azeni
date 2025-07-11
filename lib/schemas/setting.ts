import { z } from "zod";

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
  rsvpDeadline: z.date({
    required_error: "Tanggal wajib diisi",
    invalid_type_error: "Format tanggal tidak valid",
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
    z.date({
      required_error: "Tanggal wajib diisi",
      invalid_type_error: "Format tanggal tidak valid",
    })
  ),
  rsvpAllowNote: z.boolean({
    required_error: "Status catatan tambahan wajib diisi",
    invalid_type_error:
      "Status catatan tambahan harus berupa boolean (ya/tidak)",
  }),
});
