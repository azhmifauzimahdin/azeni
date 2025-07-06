import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const scheduleSchema = z
  .object({
    name: z
      .string({
        required_error: "Nama Acara wajib diisi",
        invalid_type_error: "Nama Acara harus berupa teks",
      })
      .min(1, { message: "Nama Acara wajib diisi" })
      .max(255, { message: "Nama Acara terlalu panjang" }),

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

    timezone: z
      .string({
        required_error: "Zona waktu wajib diisi",
        invalid_type_error: "Zona waktu harus berupa teks",
      })
      .min(1, { message: "Zona waktu wajib diisi" })
      .max(100, { message: "Zona waktu terlalu panjang" }),

    location: z
      .string({
        required_error: "Lokasi wajib diisi",
        invalid_type_error: "Lokasi harus berupa teks",
      })
      .min(1, { message: "Lokasi wajib diisi" })
      .max(500, { message: "Lokasi terlalu panjang" }),

    locationMaps: z
      .string({
        required_error: "Link Google Maps wajib diisi",
        invalid_type_error: "Deskripsi harus berupa teks",
      })
      .min(1, { message: "Link Google Maps wajib diisi" })
      .url({ message: "Link Google Maps tidak valid" }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
  });

export const createApiScheduleSchema = z
  .object({
    name: z
      .string({
        required_error: "Nama Acara wajib diisi",
        invalid_type_error: "Nama Acara harus berupa teks",
      })
      .min(1, { message: "Nama Acara wajib diisi" })
      .max(255, { message: "Nama Acara terlalu panjang" }),

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

    timezone: z
      .string({
        required_error: "Zona waktu wajib diisi",
        invalid_type_error: "Zona waktu harus berupa teks",
      })
      .min(1, { message: "Zona waktu wajib diisi" })
      .max(100, { message: "Zona waktu terlalu panjang" }),

    location: z
      .string({
        required_error: "Lokasi wajib diisi",
        invalid_type_error: "Lokasi harus berupa teks",
      })
      .min(1, { message: "Lokasi wajib diisi" })
      .max(500, { message: "Lokasi terlalu panjang" }),

    locationMaps: z
      .string({
        required_error: "Link Google Maps wajib diisi",
        invalid_type_error: "Link Gogle Maps harus berupa teks",
      })
      .min(1, { message: "Link Google Maps wajib diisi" })
      .url({ message: "Link Google Maps tidak valid" }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
  });

export const updateApiScheduleSchema = z
  .object({
    name: z
      .string({
        required_error: "Nama Acara wajib diisi",
        invalid_type_error: "Nama Acara harus berupa teks",
      })
      .min(1, { message: "Nama Acara wajib diisi" })
      .max(255, { message: "Nama Acara terlalu panjang" }),

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

    timezone: z
      .string({
        required_error: "Zona waktu wajib diisi",
        invalid_type_error: "Zona waktu harus berupa teks",
      })
      .min(1, { message: "Zona waktu wajib diisi" })
      .max(100, { message: "Zona waktu terlalu panjang" }),

    location: z
      .string({
        required_error: "Lokasi wajib diisi",
        invalid_type_error: "Lokasi harus berupa teks",
      })
      .min(1, { message: "Lokasi wajib diisi" })
      .max(500, { message: "Lokasi terlalu panjang" }),

    locationMaps: z
      .string({
        required_error: "Link Google Maps wajib diisi",
        invalid_type_error: "Link Gogle Maps harus berupa teks",
      })
      .min(1, { message: "Link Google Maps wajib diisi" })
      .url({ message: "Link Google Maps tidak valid" }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
  });
