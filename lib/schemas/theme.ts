import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

const decimalSchema = z
  .string()
  .refine((val) => !isNaN(Number(val)), {
    message: "Harus berupa angka yang valid",
  })
  .transform((val) => Number(val));

export const createThemeSchema = z.object({
  name: z
    .string({
      required_error: "Nama tema wajib diisi",
      invalid_type_error: "Nama tema harus berupa teks",
    })
    .min(1, { message: "Nama tema tidak boleh kosong" }),

  thumbnail: z
    .string({
      required_error: "URL thumbnail wajib diisi",
      invalid_type_error: "Thumbnail harus berupa string",
    })
    .url({ message: "Thumbnail harus berupa URL yang valid" }),
  categoryId: z
    .string({
      required_error: "Kategori tema wajib dipilih",
      invalid_type_error: "Kategori tidak valid",
    })
    .uuid({ message: "ID kategori tidak valid" }),

  colorTag: z
    .string({
      required_error: "Tag warna wajib diisi",
      invalid_type_error: "Tag warna harus berupa teks",
    })
    .min(1, { message: "Tag warna tidak boleh kosong" }),

  originalPrice: decimalSchema.refine((val) => val > 0, {
    message: "Harga asli harus lebih dari 0",
  }),

  discount: decimalSchema.refine((val) => val >= 0, {
    message: "Diskon harus lebih dari 0",
  }),

  isPercent: z.boolean({
    required_error: "Harus pilih apakah diskon persen atau nominal",
  }),

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

  image: z
    .string({
      invalid_type_error: "URL gambar harus berupa string",
    })
    .url({ message: "Gambar harus berupa URL yang valid" })
    .optional()
    .or(z.literal("").transform(() => undefined)),

  musicId: z
    .string({
      required_error: "ID musik wajib diisi",
      invalid_type_error: "ID musik harus berupa teks",
    })
    .min(1, { message: "ID musik tidak boleh kosong" }),
  date: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date ? new Date(val) : val,
    z
      .date({
        required_error: "Tanggal  wajib diisi",
        invalid_type_error: "Format tanggal  tidak valid",
      })
      .refine((date) => date >= today, {
        message: "Tanggal harus hari ini atau lebih",
      })
  ),
  expiresAt: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date ? new Date(val) : val,
    z
      .date({
        required_error: "Tanggal kedaluwarsa  wajib diisi",
        invalid_type_error: "Format tanggal kedaluwarsa  tidak valid",
      })
      .refine((date) => date >= today, {
        message: "Tanggal kedaluwarsa harus hari ini atau lebih",
      })
  ),
});

export const createThemeFormSchema = z.object({
  name: z
    .string({
      required_error: "Nama tema wajib diisi",
      invalid_type_error: "Nama tema harus berupa teks",
    })
    .min(1, { message: "Nama tema tidak boleh kosong" }),

  thumbnail: z
    .string({
      required_error: "Thumbnail wajib diisi",
    })
    .min(1, { message: "Thumbnail tidak boleh kosong" }),
  categoryId: z
    .string({
      required_error: "Kategori tema wajib dipilih",
      invalid_type_error: "Kategori tidak valid",
    })
    .uuid({ message: "ID kategori tidak valid" }),

  colorTag: z
    .string({
      required_error: "Tag warna wajib diisi",
      invalid_type_error: "Tag warna harus berupa teks",
    })
    .min(1, { message: "Tag warna tidak boleh kosong" }),

  originalPrice: z
    .string({ required_error: "Harga harus diisi" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Harga harus berupa angka lebih dari 0",
    }),

  discount: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === "" ||
        (!isNaN(Number(val)) && Number(val) >= 0),
      {
        message: "Maksimal diskon harus berupa angka lebih dari 0",
      }
    )
    .or(z.literal("").transform(() => undefined)),

  isPercent: z.boolean({
    required_error: "Harus pilih apakah diskon persen atau nominal",
  }),

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

  image: z
    .string({
      required_error: "Gambar wajib diisi",
    })
    .min(1, { message: "Gambar tidak boleh kosong" }),

  musicId: z
    .string({
      required_error: "ID musik wajib diisi",
      invalid_type_error: "ID musik harus berupa teks",
    })
    .min(1, { message: "ID musik tidak boleh kosong" }),

  date: z
    .date({
      required_error: "Tanggal wajib diisi",
      invalid_type_error: "Format tanggal tidak valid",
    })
    .refine((date) => date >= today, {
      message: "Tanggal harus hari ini atau lebih",
    }),
  expiresAt: z
    .date({
      required_error: "Tanggal kedaluwarsa wajib diisi",
      invalid_type_error: "Format tanggal kedaluwarsa tidak valid",
    })
    .refine((date) => date >= today, {
      message: "Tanggal kedaluwarsa harus hari ini atau lebih",
    }),
});

export const patchThemeSchema = z.object({
  themeId: z.string().min(1, { message: "Tema undangan wajib dipilih" }),
});
