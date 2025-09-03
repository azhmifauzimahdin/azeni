import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const updateDateInvitationSchema = z.object({
  date: z
    .date({
      required_error: "Tanggal wajib diisi",
      invalid_type_error: "Format tanggal tidak valid",
    })
    .refine((date) => date >= today, {
      message: "Tanggal harus hari ini atau lebih",
    }),
  useScheduleDate: z.boolean({
    required_error: "Status wajib diisi",
    invalid_type_error: "Status  harus berupa boolean (ya/tidak)",
  }),
});

export const updateDateInvitationApiSchema = z.object({
  date: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date ? new Date(val) : val,
    z
      .date({
        required_error: "Tanggal wajib diisi",
        invalid_type_error: "Format tanggal tidak valid",
      })
      .refine((date) => date >= today, {
        message: "Tanggal harus hari ini atau lebih",
      })
  ),
  useScheduleDate: z.boolean({
    required_error: "Status wajib diisi",
    invalid_type_error: "Status  harus berupa boolean (ya/tidak)",
  }),
});

export const updateLinkInvitationSchema = z.object({
  url: z
    .string()
    .min(3, { message: "Link undangan minimal terdiri dari 3 karakter." })
    .max(30, { message: "Link undangan maksimal terdiri dari 30 karakter." })
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
      message:
        "Link undangan hanya boleh huruf kecil, angka, dan tanda hubung (-), tidak boleh diawali atau diakhiri dengan '-'.",
    }),
});

export const updateImageInvitationSchema = z.object({
  image: z.string().min(1, { message: "Foto tidak boleh kosong" }),
});

export const createApiInvitationSchema = z.object({
  themeId: z
    .string({
      required_error: "ID tema wajib diisi",
      invalid_type_error: "ID tema harus berupa teks",
    })
    .min(1, { message: "ID tema tidak boleh kosong" }),
  groom: z
    .string({
      required_error: "Nama mempelai pria wajib diisi",
      invalid_type_error: "Nama mempelai pria harus berupa teks",
    })
    .min(1, { message: "Nama mempelai pria tidak boleh kosong" }),

  bride: z
    .string({
      required_error: "Nama mempelai wanita wajib diisi",
      invalid_type_error: "Nama mempelai wanita harus berupa teks",
    })
    .min(1, { message: "Nama mempelai wanita tidak boleh kosong" }),

  slug: z
    .string({
      required_error: "Slug wajib diisi",
      invalid_type_error: "Slug harus berupa teks",
    })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)",
    }),

  image: z
    .string()
    .min(1, { message: "Foto tidak boleh kosong" })
    .or(z.literal("")),

  date: z
    .string({
      required_error: "Tanggal acara wajib diisi",
      invalid_type_error: "Tanggal acara harus berupa string ISO",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Tanggal acara tidak valid",
    }),

  expiresAt: z
    .string({
      required_error: "Tanggal kedaluwarsa wajib diisi",
      invalid_type_error: "Tanggal kedaluwarsa harus berupa string ISO",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Tanggal kedaluwarsa tidak valid",
    }),
});

export const createInvitationSchema = (withPhoto: boolean) =>
  z.object({
    themeId: z
      .string({
        required_error: "ID tema wajib diisi",
        invalid_type_error: "ID tema harus berupa teks",
      })
      .min(1, { message: "ID tema tidak boleh kosong" }),
    groom: z
      .string({
        required_error: "Nama mempelai pria wajib diisi",
        invalid_type_error: "Nama mempelai pria harus berupa teks",
      })
      .min(1, { message: "Nama mempelai pria tidak boleh kosong" }),

    bride: z
      .string({
        required_error: "Nama mempelai wanita wajib diisi",
        invalid_type_error: "Nama mempelai wanita harus berupa teks",
      })
      .min(1, { message: "Nama mempelai wanita tidak boleh kosong" }),

    slug: z
      .string({
        required_error: "Slug wajib diisi",
        invalid_type_error: "Slug harus berupa teks",
      })
      .regex(/^[a-z0-9-]+$/, {
        message:
          "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)",
      }),

    image: withPhoto
      ? z
          .string({
            required_error: "Foto wajib diisi",
          })
          .min(1, { message: "Foto tidak boleh kosong" })
      : z.string().optional(),

    date: z
      .string({
        required_error: "Tanggal acara wajib diisi",
        invalid_type_error: "Tanggal acara harus berupa string ISO",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Tanggal acara tidak valid",
      }),

    expiresAt: z
      .string({
        required_error: "Tanggal kedaluwarsa wajib diisi",
        invalid_type_error: "Tanggal kedaluwarsa harus berupa string ISO",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Tanggal kedaluwarsa tidak valid",
      }),
  });
