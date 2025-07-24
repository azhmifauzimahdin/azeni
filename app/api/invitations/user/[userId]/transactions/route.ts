import { prisma } from "@/lib/prisma";
import {
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  _: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return unauthorizedError();
    }

    if (userId !== params.userId) {
      return forbiddenError();
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        isActive: true,
        invitation: {
          userId,
        },
      },
      include: {
        status: true,
        webhookLogs: {
          orderBy: {
            eventAt: "desc",
          },
        },
        referralCode: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return ResponseJson(
      {
        message: "Data transaksi berhasil diambil",
        data: transactions,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil transaksi");
  }
}
