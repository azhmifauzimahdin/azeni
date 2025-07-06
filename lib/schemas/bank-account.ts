import { z } from "zod";

export const createBankAccountSchema = z.object({
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
});

export const updateBankAccountSchema = z.object({
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
});
