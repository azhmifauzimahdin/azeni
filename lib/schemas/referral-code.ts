import { z } from "zod";

const decimalSchema = z
  .string()
  .refine((val) => !isNaN(Number(val)), {
    message: "Harus berupa angka yang valid",
  })
  .transform((val) => Number(val));

export const referralCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]+$/, {
      message: "Kode hanya boleh terdiri dari huruf kapital dan angka",
    })
    .min(6, { message: "Kode referral minimal 6 karakter" })
    .max(12, { message: "Kode referral maksimal 12 karakter" }),

  description: z
    .string({
      required_error: "Dekripsi wajib diisi",
      invalid_type_error: "Dekripsi harus berupa teks",
    })
    .min(1, { message: "Dekripsi tidak boleh kosong" })
    .max(255, { message: "Deskripsi tidak boleh lebih dari 255 karakter" }),

  discount: decimalSchema.refine((val) => val > 0, {
    message: "Diskon harus lebih dari 0",
  }),

  isPercent: z.boolean({
    required_error: "Harus pilih apakah diskon persen atau nominal",
  }),

  maxDiscount: decimalSchema
    .refine((val) => val >= 0, {
      message: "Maksimal diskon harus lebih dari 0",
    })
    .optional()
    .or(z.literal("").transform(() => undefined)),

  isActive: z.boolean().default(true),
});

export const referralCodeFormSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]+$/, {
      message: "Kode hanya boleh terdiri dari huruf kapital dan angka",
    })
    .min(6, { message: "Kode referral minimal 6 karakter" })
    .max(12, { message: "Kode referral maksimal 12 karakter" }),

  description: z
    .string({
      required_error: "Dekripsi wajib diisi",
      invalid_type_error: "Dekripsi harus berupa teks",
    })
    .min(1, { message: "Dekripsi tidak boleh kosong" })
    .max(255, { message: "Deskripsi tidak boleh lebih dari 255 karakter" }),

  discount: z
    .string({ required_error: "Diskon harus diisi" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Diskon harus berupa angka lebih dari 0",
    }),

  isPercent: z.boolean({
    required_error: "Harus pilih apakah diskon persen atau nominal",
  }),

  maxDiscount: z
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

  isActive: z.boolean({
    required_error: "Status wajib diisi",
    invalid_type_error: "Status harus berupa boolean (ya/tidak)",
  }),
});
