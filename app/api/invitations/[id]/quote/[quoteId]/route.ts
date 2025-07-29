import { prisma } from "@/lib/prisma";
import {
  expiredInvitationError,
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isBefore } from "date-fns";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string; quoteId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

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

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        ...(role !== "admin" && { userId }),
      },
      include: {
        transaction: {
          include: {
            status: true,
          },
        },
      },
    });

    if (!invitationByUserId) return forbiddenError();
    const transactionStatus = invitationByUserId.transaction?.status?.name;
    if (transactionStatus !== "SUCCESS") {
      return unpaidInvitationError();
    }
    const now = new Date();
    if (isBefore(invitationByUserId.expiresAt, now)) {
      return expiredInvitationError();
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
