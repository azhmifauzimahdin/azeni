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
