import { z } from "zod";

export const rsvpSchema = z.object({
  guestId: z
    .string({
      required_error: "ID tamu wajib diisi",
      invalid_type_error: "ID tamu harus berupa string",
    })
    .min(1, { message: "ID tamu tidak boleh kosong" }),

  isAttending: z.boolean({
    required_error: "isAttending harus diisi (true/false)",
    invalid_type_error: "isAttending harus berupa boolean",
  }),

  totalGuests: z
    .number({
      required_error: "Jumlah orang wajib diisi",
      invalid_type_error: "Jumlah orang harus berupa angka",
    })
    .min(0, { message: "Jumlah orang minimal 0" }),

  notes: z.string().max(200, "Catatan maksimal 200 karakter").optional(),
});

export const createRsvpSchema = (maxGuestsAllowed: number) =>
  z.object({
    isAttending: z.boolean({
      required_error: "isAttending harus diisi (true/false)",
      invalid_type_error: "isAttending harus berupa boolean",
    }),

    totalGuests: z
      .number({
        required_error: "Jumlah orang wajib diisi",
        invalid_type_error: "Jumlah orang harus berupa angka",
      })
      .min(0, { message: "Jumlah orang minimal 0" })
      .max(maxGuestsAllowed, `Maksimal ${maxGuestsAllowed} orang`),

    notes: z.string().max(200, "Catatan maksimal 200 karakter").optional(),
  });
