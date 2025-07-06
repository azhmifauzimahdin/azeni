import { z } from "zod";

export const createQuoteSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Isi kutipan tidak boleh kosong" })
    .max(1000, { message: "Isi kutipan terlalu panjang" }),

  author: z
    .string()
    .min(1, { message: "Nama penulis wajib diisi" })
    .max(255, { message: "Nama penulis terlalu panjang" }),
});
