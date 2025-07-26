import { z } from "zod";

export const themeCategorySchema = z.object({
  name: z
    .string({
      required_error: "Nama tema wajib diisi",
      invalid_type_error: "Nama tema harus berupa teks",
    })
    .min(1, { message: "Nama tema tidak boleh kosong" }),
});
