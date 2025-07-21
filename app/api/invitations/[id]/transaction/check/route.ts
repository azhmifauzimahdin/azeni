import { prisma } from "@/lib/prisma";
import {
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return unauthorizedError();
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

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        userId,
        transaction: {
          orderId: params.id,
        },
      },
      include: {
        transaction: {
          include: {
            status: true,
          },
        },
      },
    });

    if (!invitationByUserId) {
      return ResponseJson(
        {
          message: "Transaksi tidak ditemukan",
          data: null,
        },
        { status: 200 }
      );
    }

    return ResponseJson(
      {
        message: "Data transaksi berhasil diambil",
        data: invitationByUserId.transaction,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil transaksi");
  }
}
