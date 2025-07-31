import { prisma } from "@/lib/prisma";
import {
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const music = await prisma.music.findMany({
      where: {
        visibility: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return ResponseJson(
      {
        message: "Data musik berhasil diambil",
        data: music,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil musik");
  }
}
