import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const createLiveStreamSchema = z
  .object({
    startDate: z
      .date({
        required_error: "Tanggal mulai wajib diisi",
        invalid_type_error: "Format tanggal mulai tidak valid",
      })
      .refine((date) => date >= today, {
        message: "Tanggal harus hari ini atau lebih",
      }),
    endDate: z
      .date({
        required_error: "Tanggal selesai wajib diisi",
        invalid_type_error: "Format tanggal selesai tidak valid",
      })
      .refine((date) => date >= today, {
        message: "Tanggal harus hari ini atau lebih",
      }),

    urlYoutube: z
      .string({ invalid_type_error: "YouTube harus berupa teks" })
      .url({ message: "Link YouTube harus berupa URL yang valid" })
      .optional()

      .or(z.literal("")),

    urlInstagram: z
      .string({
        invalid_type_error: "Instagram mempelai wanita harus berupa teks",
      })
      .url({
        message: "Link Instagram mempelai wanita harus berupa URL yang valid",
      })
      .optional()
      .or(z.literal("")),

    urlFacebook: z
      .string({ invalid_type_error: "Facebook harus berupa teks" })
      .url({ message: "Link Facebook harus berupa URL yang valid" })
      .optional()
      .or(z.literal("")),

    urlTiktok: z
      .string({ invalid_type_error: "TikTok harus berupa teks" })
      .url({ message: "Link TikTok harus berupa URL yang valid" })
      .optional()
      .or(z.literal("")),

    urlZoom: z
      .string({ invalid_type_error: "Zoom harus berupa teks" })
      .url({ message: "Link Zoom harus berupa URL yang valid" })
      .optional()
      .or(z.literal("")),

    urlCustom: z
      .string({ invalid_type_error: "Custom harus berupa teks" })
      .url({ message: "Link Custom harus berupa URL yang valid" })
      .optional()
      .or(z.literal("")),
    description: z
      .string({ invalid_type_error: "Deskripsi harus berupa teks" })
      .max(500, "Deskripsi maksimal 500 karakter")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
  });

export const createApiLiveStreamSchema = z
  .object({
    startDate: z.preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date ? new Date(val) : val,
      z
        .date({
          required_error: "Tanggal mulai wajib diisi",
          invalid_type_error: "Format tanggal mulai tidak valid",
        })
        .refine((date) => date >= today, {
          message: "Tanggal harus hari ini atau lebih",
        })
    ),

    endDate: z.preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date ? new Date(val) : val,
      z
        .date({
          required_error: "Tanggal selesai wajib diisi",
          invalid_type_error: "Format tanggal selesai tidak valid",
        })
        .refine((date) => date >= today, {
          message: "Tanggal harus hari ini atau lebih",
        })
    ),
    urlYoutube: z
      .string({ invalid_type_error: "YouTube harus berupa teks" })
      .url({ message: "Link YouTube harus berupa URL yang valid" })
      .optional()

      .or(z.literal("")),

    urlInstagram: z
      .string({
        invalid_type_error: "Instagram mempelai wanita harus berupa teks",
      })
      .url({
        message: "Link Instagram mempelai wanita harus berupa URL yang valid",
      })
      .optional()
      .or(z.literal("")),

    urlFacebook: z
      .string({ invalid_type_error: "Facebook harus berupa teks" })
      .url({ message: "Link Facebook harus berupa URL yang valid" })
      .optional()
      .or(z.literal("")),

    urlTiktok: z
      .string({ invalid_type_error: "TikTok harus berupa teks" })
      .url({ message: "Link TikTok harus berupa URL yang valid" })
      .optional()
      .or(z.literal("")),

    urlZoom: z
      .string({ invalid_type_error: "Zoom harus berupa teks" })
      .url({ message: "Link Zoom harus berupa URL yang valid" })
      .optional()
      .or(z.literal("")),

    urlCustom: z
      .string({ invalid_type_error: "Custom harus berupa teks" })
      .url({ message: "Link Custom harus berupa URL yang valid" })
      .optional()
      .or(z.literal("")),
    description: z
      .string({ invalid_type_error: "Deskripsi harus berupa teks" })
      .max(500, "Deskripsi maksimal 500 karakter")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
  });
