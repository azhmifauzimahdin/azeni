import { z } from "zod";

export const bankSchema = z.object({
  name: z
    .string({
      required_error: "Nama bank wajib diisi",
    })
    .min(1, { message: "Nama bank tidak boleh kosong" }),

  icon: z
    .string({
      required_error: "Logo wajib diisi",
    })
    .min(1, { message: "Logo tidak boleh kosong" }),
});
