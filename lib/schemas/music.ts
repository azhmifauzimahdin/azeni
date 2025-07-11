import { z } from "zod";

export const musicIdSchema = z.object({
  musicId: z
    .string({
      required_error: "ID musik wajib diisi",
      invalid_type_error: "ID musik harus berupa teks",
    })
    .min(1, { message: "ID musik tidak boleh kosong" }),
});

export const createMusicSchema = z.object({
  file: z.custom<File>((val) => val instanceof File && val.size > 0, {
    message: "File wajib diunggah dan harus bertipe file",
  }),
});
