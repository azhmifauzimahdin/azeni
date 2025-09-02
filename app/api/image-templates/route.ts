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

    const imageTemplate = await prisma.imageTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return ResponseJson(
      {
        message: "Data template gambar berhasil diambil",
        data: imageTemplate,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil template gambar");
  }
}
