import { z } from "zod";

export const createCommentSchema = z.object({
  guestId: z
    .string({
      required_error: "ID tamu wajib diisi",
      invalid_type_error: "ID tamu harus berupa string",
    })
    .min(1, { message: "ID tamu tidak boleh kosong" }),

  message: z
    .string({
      required_error: "Pesan wajib diisi",
      invalid_type_error: "Pesan harus berupa teks",
    })
    .min(1, { message: "Pesan tidak boleh kosong" })
    .max(1000, { message: "Pesan tidak boleh lebih dari 1000 karakter" }),
});
