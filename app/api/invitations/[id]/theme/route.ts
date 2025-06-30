import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const body = await req.json();

    const { themeId } = body;

    const errors = [];
    if (!themeId)
      errors.push({ field: "themeId", message: "Tema ID harus diisi." });
    if (!params.id)
      errors.push({
        field: "invitationId",
        message: "Invitation ID harus diisi.",
      });

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId)
      return ResponseJson("Unauthorized", { status: 401 });

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

    return ResponseJson(theme, { status: 201 });
  } catch (error) {
    console.error("Error update themeId:", error);
    return ResponseJson({ message: "Gagal update tema." }, { status: 500 });
  }
}
