import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const { guestId, message } = body;

    const errors = [];
    if (!guestId)
      errors.push({ field: "guestId", message: "Guest Id harus diisi." });
    if (!message)
      errors.push({ field: "message", message: "Pesan harus diisi." });
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

    const guest = await prisma.guest.findFirst({
      where: {
        id: guestId,
        invitationId: params.id,
      },
    });

    if (!guest) return new NextResponse("Unauthorized", { status: 401 });

    const newComment = await prisma.comment.create({
      data: { guestId, message, invitationId: params.id },
      include: {
        guest: true,
      },
    });

    return ResponseJson(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return ResponseJson(
      { message: "Gagal membuat komentar." },
      { status: 500 }
    );
  }
}
