import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const scheduleSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Nama Acara wajib diisi" })
      .max(255, { message: "Nama Acara terlalu panjang" }),

    startDate: z.date().refine((date) => date >= today, {
      message: "Tanggal harus hari ini atau lebih",
    }),
    endDate: z.date().refine((date) => date >= today, {
      message: "Tanggal harus hari ini atau lebih",
    }),

    timezone: z
      .string()
      .min(1, { message: "Zona waktu wajib diisi" })
      .max(100, { message: "Zona waktu terlalu panjang" }),

    location: z
      .string()
      .min(1, { message: "Lokasi wajib diisi" })
      .max(500, { message: "Lokasi terlalu panjang" }),

    locationMaps: z
      .string()
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
      .string()
      .min(1, { message: "Nama Acara wajib diisi" })
      .max(255, { message: "Nama Acara terlalu panjang" }),

    startDate: z.preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date ? new Date(val) : val,
      z.date().refine((date) => date >= today, {
        message: "Tanggal harus hari ini atau lebih",
      })
    ),

    endDate: z.preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date ? new Date(val) : val,
      z.date().refine((date) => date >= today, {
        message: "Tanggal harus hari ini atau lebih",
      })
    ),

    timezone: z
      .string()
      .min(1, { message: "Zona waktu wajib diisi" })
      .max(100, { message: "Zona waktu terlalu panjang" }),

    location: z
      .string()
      .min(1, { message: "Lokasi wajib diisi" })
      .max(500, { message: "Lokasi terlalu panjang" }),

    locationMaps: z
      .string()
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
      .string()
      .min(1, { message: "Nama Acara wajib diisi" })
      .max(255, { message: "Nama Acara terlalu panjang" }),

    startDate: z.preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date ? new Date(val) : val,
      z.date().refine((date) => date >= today, {
        message: "Tanggal harus hari ini atau lebih",
      })
    ),

    endDate: z.preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date ? new Date(val) : val,
      z.date().refine((date) => date >= today, {
        message: "Tanggal harus hari ini atau lebih",
      })
    ),

    timezone: z
      .string()
      .min(1, { message: "Zona waktu wajib diisi" })
      .max(100, { message: "Zona waktu terlalu panjang" }),

    location: z
      .string()
      .min(1, { message: "Lokasi wajib diisi" })
      .max(500, { message: "Lokasi terlalu panjang" }),

    locationMaps: z
      .string()
      .min(1, { message: "Link Google Maps wajib diisi" })
      .url({ message: "Link Google Maps tidak valid" }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
  });
