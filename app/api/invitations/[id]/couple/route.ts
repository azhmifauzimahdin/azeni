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

    const {
      groomName,
      groomFather,
      groomMother,
      brideName,
      brideFather,
      brideMother,
    } = body;

    const errors = [];
    if (!groomName)
      errors.push({
        field: "groomName",
        message: "Nama mempelai pria harus diisi.",
      });
    if (!groomFather)
      errors.push({
        field: "groomFather",
        message: "Nama ayah mempelai pria harus diisi.",
      });
    if (!groomMother)
      errors.push({
        field: "groomMother",
        message: "Nama ibu mempelai pria harus diisi.",
      });
    if (!brideName)
      errors.push({
        field: "brideName",
        message: "Nama mempelai wanita harus diisi.",
      });
    if (!brideFather)
      errors.push({
        field: "brideFather",
        message: "Nama ayah mempelai wanita harus diisi.",
      });
    if (!brideMother)
      errors.push({
        field: "brideMother",
        message: "Nama ibu mempelai wanita harus diisi.",
      });
    if (!params.id)
      errors.push({
        field: "invitationId",
        message: "Invitation ID harus diisi.",
      });

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId)
      return ResponseJson("Unauthorized", { status: 401 });

    const quote = await prisma.couple.upsert({
      where: {
        invitationId: params.id,
      },
      update: {
        groomName,
        groomFather,
        groomMother,
        brideName,
        brideFather,
        brideMother,
      },
      create: {
        invitationId: params.id,
        groomImage: "",
        groomName,
        groomFather,
        groomMother,
        brideImage: "",
        brideName,
        brideFather,
        brideMother,
      },
    });

    return ResponseJson(quote, { status: 201 });
  } catch (error) {
    console.error("Error creating couple:", error);
    return ResponseJson(
      { message: "Gagal membuat pasangan." },
      { status: 500 }
    );
  }
}
