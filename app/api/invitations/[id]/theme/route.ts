import { prisma } from "@/lib/prisma";
import { ThemeSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = ThemeSchema.patchThemeSchema.safeParse(body);

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
