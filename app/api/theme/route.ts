import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const body = await req.json();

    const { name, originalPrice, discount } = body;

    const errors = [];
    if (!name) errors.push({ field: "name", message: "Nama harus diisi." });
    if (!originalPrice)
      errors.push({ field: "originalPrice", message: "Harga harus diisi." });
    if (!discount)
      errors.push({ field: "discount", message: "Diskon harus diisi." });

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const newTheme = await prisma.theme.create({
      data: { name, originalPrice, discount },
    });

    return ResponseJson(newTheme, { status: 201 });
  } catch (error) {
    console.error("Error creating theme:", error);
    return ResponseJson({ message: "Gagal membuat tema." }, { status: 500 });
  }
}
