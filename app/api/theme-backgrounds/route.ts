import { prisma } from "@/lib/prisma";
import { handleError, ResponseJson } from "@/lib/utils/response";

export async function GET() {
  try {
    const themeBackground = await prisma.themeBackground.findMany({
      orderBy: { image: "asc" },
    });

    return ResponseJson(
      {
        message: "Data background tema berhasil diambil",
        data: themeBackground,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil data bakcgounr tema");
  }
}
