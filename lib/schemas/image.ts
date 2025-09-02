import { z } from "zod";

export const deleteImageSchema = z.object({
  public_id: z.string({
    required_error: "Public ID wajib diisi",
    invalid_type_error: "Public ID harus berupa string",
  }),
});

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heif",
  "image/heic",
];

export const FILE_TRANFORMATION = "c_limit,w_1200,q_auto,f_auto";

const FILE_EXTENSION_REGEX = /\.(jpe?g|png|webp|heif|heic)$/i;

export const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 20 * 1024 * 1024, {
    message: "Ukuran file terlalu besar untuk diproses",
  })
  .refine(
    (file) => {
      const mimeValid =
        file.type && ACCEPTED_MIME_TYPES.includes(file.type.toLowerCase());
      const extValid = FILE_EXTENSION_REGEX.test(file.name);
      return mimeValid || extValid;
    },
    {
      message:
        "Format file tidak didukung. Gunakan JPG, PNG, WebP, HEIF, atau HEIC.",
    }
  );

export const imageFieldSchema = z.object({
  field: z.enum(["groomImage", "brideImage"], {
    required_error: "Field gambar wajib diisi",
    invalid_type_error: "Field gambar harus berupa string tertentu",
  }),

  url: z.string({
    required_error: "URL gambar wajib diisi",
    invalid_type_error: "URL gambar harus berupa teks",
  }),
});
