import { prisma } from "@/lib/prisma";
import {
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string; quoteId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

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

    if (!params.quoteId) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            quoteId: ["Quote ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    const InvitaionByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        transaction: {
          include: {
            status: true,
          },
        },
      },
    });

    if (!InvitaionByUserId) return forbiddenError();
    const transactionStatus = InvitaionByUserId.transaction?.status?.name;
    if (transactionStatus !== "SUCCESS") {
      return unpaidInvitationError();
    }

    const quote = await prisma.quote.delete({
      where: {
        id: params.quoteId,
      },
    });

    return ResponseJson(
      { message: "Kutipan berhasil dihapus", data: quote },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus kutipan");
  }
}
