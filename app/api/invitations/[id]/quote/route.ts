import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const body = await req.json();

    const { name, author } = body;

    const errors = [];
    if (!name) errors.push({ field: "name", message: "Quote harus diisi." });
    if (!author)
      errors.push({ field: "author", message: "Author harus diisi." });
    if (!params.id)
      errors.push({
        field: "invitationId",
        message: "Invitation ID harus diisi.",
      });

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const invitation = await prisma.invitation.findFirst({
      where: {
        id: params.id,
      },
    });

    if (!invitation) {
      return ResponseJson(
        { message: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId)
      return ResponseJson("Unauthorized", { status: 401 });

    const quote = await prisma.quote.upsert({
      where: {
        invitationId: params.id,
      },
      update: {
        name: "Updated Quote",
        author: "John Doe",
      },
      create: { name, author, invitationId: params.id },
    });

    return ResponseJson(quote, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return ResponseJson({ message: "Gagal membuat quote." }, { status: 500 });
  }
}
