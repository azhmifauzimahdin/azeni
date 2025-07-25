import { z } from "zod";

export const musicIdSchema = z.object({
  musicId: z
    .string({
      required_error: "ID musik wajib diisi",
      invalid_type_error: "ID musik harus berupa teks",
    })
    .min(1, { message: "ID musik tidak boleh kosong" }),
});

export const apiMusicSchema = z.object({
  name: z
    .string({
      required_error: "Nama wajib diisi",
      invalid_type_error: "Nama harus berupa teks",
    })
    .min(1, { message: "Nama tidak boleh kosong" }),

  src: z
    .string({
      required_error: "File musik wajib diisi",
    })
    .min(1, { message: "File musik tidak boleh kosong" }),

  origin: z
    .string({
      required_error: "Asal musik wajib diisi",
      invalid_type_error: "Asal musik harus berupa teks",
    })
    .min(1, { message: "Asal musik tidak boleh kosong" }),

  visibility: z.boolean({
    required_error: "Visibility harus diisi (true/false)",
    invalid_type_error: "Visibility harus berupa boolean",
  }),
});
