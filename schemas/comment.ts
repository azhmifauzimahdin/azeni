import { z } from "zod";

export const CommentFormSchema = z.object({
  message: z.string().min(5),
});

export type CommentFormValues = z.infer<typeof CommentFormSchema>;
