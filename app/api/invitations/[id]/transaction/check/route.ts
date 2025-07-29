import { prisma } from "@/lib/prisma";
import {
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return unauthorizedError();
    }

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

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        ...(role !== "admin" && { userId }),
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
