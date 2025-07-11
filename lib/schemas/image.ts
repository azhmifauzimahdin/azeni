import { z } from "zod";

export const deleteImageSchema = z.object({
  public_id: z.string({
    required_error: "Public ID wajib diisi",
    invalid_type_error: "Public ID harus berupa string",
  }),
});

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "Ukuran file maksimal 2MB",
  })
  .refine((file) => ACCEPTED_MIME_TYPES.includes(file.type), {
    message: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP.",
  });

export const imageFieldSchema = z.object({
  field: z.enum(["groomImage", "brideImage"], {
    required_error: "Field gambar wajib diisi",
    invalid_type_error: "Field gambar harus berupa string tertentu",
  }),

  url: z
    .string({
      required_error: "URL gambar wajib diisi",
      invalid_type_error: "URL gambar harus berupa teks",
    })
    .url({ message: "URL gambar harus berupa link yang valid" }),
});
