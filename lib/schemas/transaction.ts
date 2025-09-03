import { z } from "zod";

export const createReferralSchema = z.object({
  transactionId: z.string().uuid({ message: "transactionId tidak valid" }),
  referralCode: z.string().min(1, { message: "Kode referral wajib diisi" }),
});

export const applyReferralSchema = z.object({
  referralCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]+$/, {
      message:
        "Kode hanya boleh terdiri dari huruf kapital, angka, dan strip (-)",
    })
    .min(6, { message: "Kode referral minimal 6 karakter" })
    .max(12, { message: "Kode referral maksimal 12 karakter" })
    .optional()
    .or(z.literal("")),
});
