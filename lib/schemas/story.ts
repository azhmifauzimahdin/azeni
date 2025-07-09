import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const createStorySchema = z.object({
  title: z
    .string({
      required_error: "Judul wajib diisi",
      invalid_type_error: "Judul harus berupa teks",
    })
    .min(1, { message: "Judul wajib diisi" })
    .max(255, { message: "Judul terlalu panjang" }),

  date: z.date({
    required_error: "Tanggal wajib diisi",
    invalid_type_error: "Format tanggal tidak valid",
  }),

  description: z
    .string({
      required_error: "Deskripsi wajib diisi",
      invalid_type_error: "Deskripsi harus berupa teks",
    })
    .min(1, { message: "Deskripsi tidak boleh kosong" }),

  image: z
    .string({
      invalid_type_error: "URL gambar harus berupa string",
    })
    .url({ message: "Gambar harus berupa URL yang valid" })
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export const createApiStorySchema = z.object({
  title: z
    .string({
      required_error: "Judul wajib diisi",
      invalid_type_error: "Judul harus berupa teks",
    })
    .min(1, { message: "Judul wajib diisi" })
    .max(255, { message: "Judul terlalu panjang" }),

  date: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date ? new Date(val) : val,
    z.date({
      required_error: "Tanggal wajib diisi",
      invalid_type_error: "Format tanggal tidak valid",
    })
  ),

  description: z
    .string({
      required_error: "Deskripsi wajib diisi",
      invalid_type_error: "Deskripsi harus berupa teks",
    })
    .min(1, { message: "Deskripsi tidak boleh kosong" }),

  image: z
    .string({
      invalid_type_error: "URL gambar harus berupa string",
    })
    .url({ message: "Gambar harus berupa URL yang valid" })
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export const updateAPIStorySchema = z.object({
  title: z
    .string({
      required_error: "Judul wajib diisi",
      invalid_type_error: "Judul harus berupa teks",
    })
    .min(1, { message: "Judul wajib diisi" })
    .max(255, { message: "Judul terlalu panjang" }),

  date: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date ? new Date(val) : val,
    z.date({
      required_error: "Tanggal wajib diisi",
      invalid_type_error: "Format tanggal tidak valid",
    })
  ),

  description: z
    .string({
      required_error: "Deskripsi wajib diisi",
      invalid_type_error: "Deskripsi harus berupa teks",
    })
    .min(1, { message: "Deskripsi tidak boleh kosong" }),

  image: z
    .string({
      invalid_type_error: "URL gambar harus berupa string",
    })
    .url({ message: "Gambar harus berupa URL yang valid" })
    .optional()
    .or(z.literal("").transform(() => undefined)),
});
