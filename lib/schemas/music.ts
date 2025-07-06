import { z } from "zod";

export const createMusicSchema = z.object({
  file: z.custom<File>((val) => val instanceof File && val.size > 0, {
    message: "File wajib diunggah dan harus bertipe file",
  }),
});
