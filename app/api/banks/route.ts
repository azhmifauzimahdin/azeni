import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const bank = await prisma.bank.findMany({
      where: {
        name: { not: "Kado" },
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!bank) {
      return ResponseJson({ message: "Bank tidak ditemukan" }, { status: 404 });
    }

    return ResponseJson(bank);
  } catch (error) {
    console.error("Error getting bank:", error);
    return ResponseJson(
      { message: "Gagal mengambil data bank" },
      { status: 500 }
    );
  }
}
