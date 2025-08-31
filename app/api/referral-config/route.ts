import { prisma } from "@/lib/prisma";
import { handleError, ResponseJson } from "@/lib/utils/response";

export async function GET() {
  try {
    const config = await prisma.referralConfig.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    return ResponseJson(
      {
        message: "Konfigurasi kode referral berhasil diambil",
        data: config,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil konfigurasi kode referral");
  }
}
