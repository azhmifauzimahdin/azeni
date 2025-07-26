import { prisma } from "@/lib/prisma";
import {
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const transaction = await prisma.transaction.findMany({
      where: {
        invitation: {
          isTemplate: false,
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
        data: transaction,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil data transaksi");
  }
}
