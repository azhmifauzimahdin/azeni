import { z } from "zod";

export const deleteImageSchema = z.object({
  public_id: z.string({
    required_error: "Public ID wajib diisi",
    invalid_type_error: "Public ID harus berupa string",
  }),
});
