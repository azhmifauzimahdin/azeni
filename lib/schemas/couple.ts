import { z } from "zod";

export const createCoupleSchema = z.object({
  groomName: z
    .string({
      required_error: "Nama mempelai pria wajib diisi",
      invalid_type_error: "Nama mempelai pria harus berupa teks",
    })
    .min(1, { message: "Nama mempelai pria tidak boleh kosong" }),

  groomFather: z
    .string({
      required_error: "Nama ayah mempelai pria wajib diisi",
      invalid_type_error: "Nama ayah mempelai pria harus berupa teks",
    })
    .min(1, { message: "Nama ayah mempelai pria tidak boleh kosong" }),

  groomMother: z
    .string({
      required_error: "Nama ibu mempelai pria wajib diisi",
      invalid_type_error: "Nama ibu mempelai pria harus berupa teks",
    })
    .min(1, { message: "Nama ibu mempelai pria tidak boleh kosong" }),
  groomAddress: z
    .string({
      invalid_type_error: "Alamat mempelai pria harus berupa teks",
    })
    .optional(),

  groomInstagram: z
    .string({
      invalid_type_error: "Instagram mempelai pria harus berupa teks",
    })
    .url({
      message: "Link Instagram mempelai pria harus berupa URL yang valid",
    })
    .or(z.literal(""))
    .optional(),

  brideName: z
    .string({
      required_error: "Nama mempelai wanita wajib diisi",
      invalid_type_error: "Nama mempelai wanita harus berupa teks",
    })
    .min(1, { message: "Nama mempelai wanita tidak boleh kosong" }),

  brideFather: z
    .string({
      required_error: "Nama ayah mempelai wanita wajib diisi",
      invalid_type_error: "Nama ayah mempelai wanita harus berupa teks",
    })
    .min(1, { message: "Nama ayah mempelai wanita tidak boleh kosong" }),

  brideMother: z
    .string({
      required_error: "Nama ibu mempelai wanita wajib diisi",
      invalid_type_error: "Nama ibu mempelai wanita harus berupa teks",
    })
    .min(1, { message: "Nama ibu mempelai wanita tidak boleh kosong" }),

  brideAddress: z
    .string({
      invalid_type_error: "Alamat mempelai wanita harus berupa teks",
    })
    .optional(),

  brideInstagram: z
    .string({
      invalid_type_error: "Instagram mempelai wanita harus berupa teks",
    })
    .url({
      message: "Link Instagram mempelai wanita harus berupa URL yang valid",
    })
    .or(z.literal(""))
    .optional(),
});
