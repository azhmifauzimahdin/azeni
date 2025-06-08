import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, themeId } = body;

    const errors = [];
    if (!name) errors.push({ field: "name", message: "Nama harus diisi." });
    if (!themeId)
      errors.push({ field: "themeId", message: "Tema id harus diisi." });

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newSample = await prisma.sample.create({
      data: { name, themeId },
    });

    return NextResponse.json(newSample, { status: 201 });
  } catch (error) {
    console.error("Error creating sample:", error);
    return NextResponse.json(
      { message: "Gagal membuat sampel." },
      { status: 500 }
    );
  }
}
