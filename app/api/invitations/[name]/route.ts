import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { name: string } }
) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { name: params.name },
    });

    if (!invitation) {
      return NextResponse.json(
        { message: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
