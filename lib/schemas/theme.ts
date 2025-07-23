import { z } from "zod";

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
      required_error: "Kategori tema wajib dipilih.",
      invalid_type_error: "Kategori tidak valid.",
    })
    .uuid({ message: "ID kategori tidak valid." }),

  colorTag: z
    .string({
      required_error: "Tag warna wajib diisi",
      invalid_type_error: "Tag warna harus berupa teks",
    })
    .min(1, { message: "Tag warna tidak boleh kosong" }),

  originalPrice: z
    .number({
      required_error: "Harga asli wajib diisi",
      invalid_type_error: "Harga asli harus berupa angka",
    })
    .nonnegative({ message: "Harga asli tidak boleh negatif" }),

  discount: z
    .number({
      required_error: "Diskon wajib diisi",
      invalid_type_error: "Diskon harus berupa angka",
    })
    .min(0, { message: "Diskon tidak boleh negatif" }),

  isPercent: z.boolean({
    required_error: "Jenis diskon wajib diisi",
    invalid_type_error: "Jenis diskon harus berupa nilai true/false",
  }),
});

export const patchThemeSchema = z.object({
  themeId: z.string().min(1, { message: "Tema undangan wajib dipilih" }),
});
