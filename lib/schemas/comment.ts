import { z } from "zod";

export const createCommentSchema = z.object({
  guestId: z
    .string({
      required_error: "ID tamu wajib diisi",
      invalid_type_error: "ID tamu harus berupa string",
    })
    .min(1, { message: "ID tamu tidak boleh kosong" }),

  message: z
    .string({
      required_error: "Ucapan wajib diisi",
      invalid_type_error: "Ucapan harus berupa teks",
    })
    .min(1, { message: "Ucapan tidak boleh kosong" })
    .max(1000, { message: "Ucapan tidak boleh lebih dari 1000 karakter" }),
  parentId: z
    .string({
      invalid_type_error: "Parent ID harus berupa string",
    })
    .nullable()
    .optional(),
  isReply: z.boolean({
    required_error: "isReply harus diisi (true/false)",
    invalid_type_error: "isReply harus berupa boolean",
  }),
  replyToName: z
    .string({
      invalid_type_error: "replyToName harus berupa string",
    })
    .nullable()
    .optional(),
});
