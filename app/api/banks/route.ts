import { prisma } from "@/lib/prisma";
import {
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const bank = await prisma.bank.findMany({
      where: {
        name: { not: "Kado" },
      },
      orderBy: {
        name: "asc",
      },
    });

    return ResponseJson(
      {
        message: "Data bank berhasil diambil",
        data: bank,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil data bank");
  }
}
