import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, theme } = body;

    const errors = [];
    if (!name) errors.push({ field: "name", message: "Nama harus diisi." });
    if (!theme) errors.push({ field: "theme", message: "Tema harus diisi." });

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newInvitation = await prisma.invitation.create({
      data: { name, theme },
    });

    return NextResponse.json(newInvitation, { status: 201 });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { message: "Gagal membuat undangan." },
      { status: 500 }
    );
  }
}
