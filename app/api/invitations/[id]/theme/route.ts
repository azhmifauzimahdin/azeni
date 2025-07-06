import { prisma } from "@/lib/prisma";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export const themeSchema = z.object({
  themeId: z.string().min(1, { message: "Tema undangan wajib dipilih" }),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = themeSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    if (!params.id) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            id: ["ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    const { themeId } = parsed.data;

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId) return forbiddenError();

    await prisma.invitation.update({
      where: {
        id: params.id,
      },
      data: {
        themeId,
      },
    });

    const theme = await prisma.theme.findUnique({
      where: {
        id: themeId,
      },
    });

    return ResponseJson({ message: "Tema berhasil diperbarui", data: theme });
  } catch (error) {
    return handleError(error, "Gagal memperbarui tema");
  }
}
