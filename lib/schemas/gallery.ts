import { z } from "zod";

export const createGallerySchema = z.object({
  image: z
    .string({
      required_error: "URL gambar wajib diisi",
      invalid_type_error: "URL gambar harus berupa teks",
    })
    .url("URL gambar tidak valid"),
  description: z
    .string({
      invalid_type_error: "Deskripsi harus berupa teks",
    })
    .optional()
    .default(""),
});
