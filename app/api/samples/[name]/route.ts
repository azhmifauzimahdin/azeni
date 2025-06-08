import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { name: string } }
) {
  console.log(params.name);
  try {
    const sample = await prisma.sample.findUnique({
      where: { name: params.name },
    });

    if (!sample) {
      return NextResponse.json(
        { message: "Sampel tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(sample);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
