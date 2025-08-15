import { prisma } from "@/lib/prisma";
import { CommentSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
} from "@/lib/utils/response";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = CommentSchema.createCommentSchema.safeParse(body);

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

    const { guestId, message, parentId, isReply, replyToName } = parsed.data;

    const guest = await prisma.guest.findFirst({
      where: {
        id: guestId,
        invitationId: params.id,
      },
    });

    if (!guest) return forbiddenError();

    const comment = await prisma.comment.create({
      data: {
        guestId,
        message,
        invitationId: params.id,
        parentId: parentId || null,
        isReply,
        replyToName,
      },
      include: {
        guest: true,
      },
    });

    return ResponseJson(
      {
        message: "Komentar berhasil dibuat",
        data: comment,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat komentar");
  }
}
