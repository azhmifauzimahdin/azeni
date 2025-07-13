import { z } from "zod";

export const updateLinkInvitationSchema = z.object({
  url: z
    .string()
    .min(3, { message: "Link undangan minimal terdiri dari 3 karakter." })
    .max(30, { message: "Link undangan maksimal terdiri dari 30 karakter." })
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
      message:
        "Link undangan hanya boleh huruf kecil, angka, dan tanda hubung (-), tidak boleh diawali atau diakhiri dengan '-'.",
    }),
});

export const createInvitationSchema = z.object({
  groom: z
    .string({
      required_error: "Nama mempelai pria wajib diisi",
      invalid_type_error: "Nama mempelai pria harus berupa teks",
    })
    .min(1, { message: "Nama mempelai pria tidak boleh kosong" }),

  bride: z
    .string({
      required_error: "Nama mempelai wanita wajib diisi",
      invalid_type_error: "Nama mempelai wanita harus berupa teks",
    })
    .min(1, { message: "Nama mempelai wanita tidak boleh kosong" }),

  slug: z
    .string({
      required_error: "Slug wajib diisi",
      invalid_type_error: "Slug harus berupa teks",
    })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)",
    }),

  themeId: z.string({
    required_error: "ID tema wajib diisi",
    invalid_type_error: "ID tema harus berupa string",
  }),

  musicId: z.string({
    required_error: "ID musik wajib diisi",
    invalid_type_error: "ID musik harus berupa string",
  }),

  image: z
    .string({
      invalid_type_error: "URL gambar harus berupa string",
    })
    .url({ message: "Gambar harus berupa URL yang valid" })
    .optional()
    .or(z.literal("").transform(() => undefined)),

  date: z
    .string({
      required_error: "Tanggal acara wajib diisi",
      invalid_type_error: "Tanggal acara harus berupa string ISO",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Tanggal acara tidak valid",
    }),

  expiresAt: z
    .string({
      required_error: "Tanggal kedaluwarsa wajib diisi",
      invalid_type_error: "Tanggal kedaluwarsa harus berupa string ISO",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Tanggal kedaluwarsa tidak valid",
    }),
});
