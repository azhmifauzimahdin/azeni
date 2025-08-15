import { prisma } from "@/lib/prisma";
import {
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const comment = await prisma.comment.findFirst({
      where: {
        id: params.commentId,
        invitationId: params.id,
        invitation: {
          userId: userId,
        },
      },
      include: {
        guest: true,
      },
    });

    if (!comment) {
      return ResponseJson(
        { message: "Komentar tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.comment.delete({
      where: { id: params.commentId },
    });

    return ResponseJson(
      { message: "Komentar berhasil dihapus", data: comment },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus komentar");
  }
}
