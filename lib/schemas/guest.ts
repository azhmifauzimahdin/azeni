import { z } from "zod";

export const createGuestSchema = z.object({
  name: z
    .string({
      required_error: "Nama tamu wajib diisi",
      invalid_type_error: "Nama tamu harus berupa teks",
    })
    .min(1, { message: "Nama tamu tidak boleh kosong" }),

  group: z
    .string({
      invalid_type_error: "Nama grup harus berupa teks",
    })
    .optional(),

  address: z
    .string({
      invalid_type_error: "Alamat harus berupa teks",
    })
    .optional(),
});

export const updateGuestSchema = z.object({
  name: z
    .string({
      required_error: "Nama tamu wajib diisi",
      invalid_type_error: "Nama tamu harus berupa teks",
    })
    .min(1, { message: "Nama tamu tidak boleh kosong" }),

  group: z
    .string({
      invalid_type_error: "Nama grup harus berupa teks",
    })
    .optional(),

  address: z
    .string({
      invalid_type_error: "Alamat harus berupa teks",
    })
    .optional(),
});
