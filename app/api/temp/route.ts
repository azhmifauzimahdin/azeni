import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, src } = body;

    const errors = [];
    if (!name) errors.push({ field: "name", message: "Quote harus diisi." });
    if (!src) errors.push({ field: "src", message: "Url harus diisi." });

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const music = await prisma.music.create({
      data: { name, src },
    });

    return ResponseJson(music, { status: 201 });
  } catch (error) {
    console.error("Error creating music:", error);
    return ResponseJson({ message: "Gagal membuat musik." }, { status: 500 });
  }
}
