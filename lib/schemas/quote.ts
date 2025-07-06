import { z } from "zod";

export const createQuoteSchema = z.object({
  name: z
    .string({
      required_error: "Isi kutipan wajib diisi",
      invalid_type_error: "Isi kutipan harus berupa teks",
    })
    .min(1, { message: "Isi kutipan tidak boleh kosong" })
    .max(1000, { message: "Isi kutipan terlalu panjang" }),

  author: z
    .string({
      required_error: "Nama penulis wajib diisi",
      invalid_type_error: "Nama penulis harus berupa teks",
    })
    .min(1, { message: "Nama penulis wajib diisi" })
    .max(255, { message: "Nama penulis terlalu panjang" }),
});
