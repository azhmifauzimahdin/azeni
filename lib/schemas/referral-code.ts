import { z } from "zod";
import { formatRupiah } from "../utils/currency";

const decimalSchema = z
  .string()
  .refine((val) => !isNaN(Number(val)), {
    message: "Harus berupa angka yang valid",
  })
  .transform((val) => Number(val));

export const referralCodeSchema = z.object({
  userName: z
    .string({
      required_error: "UserId wajib diisi",
      invalid_type_error: "UserId harus berupa teks",
    })
    .min(1, { message: "UserId tidak boleh kosong" })
    .max(255, { message: "UserId tidak boleh lebih dari 255 karakter" }),
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
      required_error: "Deskripsi wajib diisi",
      invalid_type_error: "Deskripsi harus berupa teks",
    })
    .min(1, { message: "Deskripsi tidak boleh kosong" })
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

  referrerReward: decimalSchema.refine((val) => val > 0, {
    message: "Reward harus lebih dari 0",
  }),

  referrerIsPercent: z.boolean({
    required_error: "Harus pilih apakah reward persen atau nominal",
  }),

  isActive: z.boolean().default(true),
});

export const referralCodeFormSchema = z.object({
  userName: z
    .string({
      required_error: "Nama user wajib diisi",
      invalid_type_error: "Nama user harus berupa teks",
    })
    .min(1, { message: "Nama user tidak boleh kosong" })
    .max(255, { message: "Nama user tidak boleh lebih dari 255 karakter" }),
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
      required_error: "Deskripsi wajib diisi",
      invalid_type_error: "Deskripsi harus berupa teks",
    })
    .min(1, { message: "Deskripsi tidak boleh kosong" })
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

  referrerReward: z
    .string({ required_error: "Reward harus diisi" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Reward harus berupa angka lebih dari 0",
    }),

  referrerIsPercent: z.boolean({
    required_error: "Harus pilih apakah diskon persen atau nominal",
  }),

  isActive: z.boolean({
    required_error: "Status wajib diisi",
    invalid_type_error: "Status harus berupa boolean (ya/tidak)",
  }),
});

export const referralWithdrawalSchema = z.object({
  amount: decimalSchema.refine((val) => val > 0, {
    message: "Jumlah harus lebih dari 0",
  }),

  bankId: z
    .string({
      required_error: "Bank wajib dipilih",
      invalid_type_error: "Bank harus berupa string",
    })
    .min(1, { message: "Bank tidak boleh kosong" }),

  accountNumber: z
    .string({
      required_error: "Nomor rekening wajib diisi",
      invalid_type_error: "Nomor rekening harus berupa string",
    })
    .min(5, { message: "Nomor rekening minimal 5 karakter" })
    .max(50, { message: "Nomor rekening terlalu panjang" }),

  name: z
    .string({
      required_error: "Nama pemilik rekening wajib diisi",
      invalid_type_error: "Nama pemilik harus berupa string",
    })
    .min(1, { message: "Nama pemilik rekening tidak boleh kosong" }),

  note: z
    .string({
      invalid_type_error: "Catatan harus berupa teks",
    })
    .max(255, { message: "Catatan tidak boleh lebih dari 255 karakter" })
    .optional()
    .or(z.literal("")),
});

export const referralWithdrawalFormSchema = (
  minAmount: number,
  maxAmount: number
) =>
  z.object({
    amount: z
      .string({ required_error: "Jumlah penarikan harus diisi" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= minAmount, {
        message: `Jumlah penarikan minimal ${formatRupiah(minAmount)}`,
      })
      .refine((val) => Number(val) <= maxAmount, {
        message: `Jumlah penarikan tidak boleh lebih dari sisa saldo ${formatRupiah(
          maxAmount
        )}`,
      }),

    bankId: z
      .string({
        required_error: "Bank wajib dipilih",
        invalid_type_error: "Bank harus berupa string",
      })
      .min(1, { message: "Bank tidak boleh kosong" }),

    accountNumber: z
      .string({
        required_error: "Nomor rekening wajib diisi",
        invalid_type_error: "Nomor rekening harus berupa string",
      })
      .min(5, { message: "Nomor rekening minimal 5 karakter" })
      .max(50, { message: "Nomor rekening terlalu panjang" }),

    name: z
      .string({
        required_error: "Nama pemilik rekening wajib diisi",
        invalid_type_error: "Nama pemilik harus berupa string",
      })
      .min(1, { message: "Nama pemilik rekening tidak boleh kosong" }),

    note: z
      .string({
        invalid_type_error: "Catatan harus berupa teks",
      })
      .max(255, { message: "Catatan tidak boleh lebih dari 255 karakter" })
      .optional()
      .or(z.literal("")),
  });

export const updateWithdrawalStatusSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED"], {
      required_error: "Status wajib diisi",
      invalid_type_error: "Status tidak valid",
    }),
    transferProofUrl: z
      .string({
        invalid_type_error: "URL gambar harus berupa string",
      })
      .url({ message: "Gambar harus berupa URL yang valid" })
      .optional()
      .or(z.literal("").transform(() => undefined)),
    note: z
      .string()
      .max(255, { message: "Catatan tidak boleh lebih dari 255 karakter" })
      .optional(),
  })
  .refine(
    (data) =>
      data.status !== "APPROVED" ||
      (data.transferProofUrl !== undefined && data.transferProofUrl !== ""),
    {
      message: "Bukti pembayaran wajib diisi jika status disetujui",
      path: ["transferProofUrl"],
    }
  )
  .refine(
    (data) =>
      data.status !== "REJECTED" ||
      (data.note !== undefined && data.note.trim() !== ""),
    {
      message: "Catatan wajib diisi jika status ditolak",
      path: ["note"],
    }
  );
