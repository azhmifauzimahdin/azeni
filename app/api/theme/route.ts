import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name } = body;

    const errors = [];
    if (!name) errors.push({ field: "name", message: "Nama harus diisi." });

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newTheme = await prisma.theme.create({
      data: { name },
    });

    return NextResponse.json(newTheme, { status: 201 });
  } catch (error) {
    console.error("Error creating theme:", error);
    return NextResponse.json(
      { message: "Gagal membuat tema." },
      { status: 500 }
    );
  }
}
