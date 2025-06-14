import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { id: string; guestId: string } }
) {
  try {
    const guest = await prisma.guest.findUnique({
      where: { id: params.guestId, invitationId: params.id },
    });

    if (!guest) {
      return NextResponse.json(
        { message: "Guest tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(guest);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
