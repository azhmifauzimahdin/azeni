import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string; quoteId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const InvitaionByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!InvitaionByUserId)
      return ResponseJson("Unauthorized", { status: 401 });

    const quote = await prisma.quote.delete({
      where: {
        id: params.quoteId,
      },
    });

    return ResponseJson(quote, { status: 200 });
  } catch (error) {
    console.error("Error deleted quote:", error);
    return ResponseJson({ message: "Gagal hapus quote." }, { status: 500 });
  }
}
