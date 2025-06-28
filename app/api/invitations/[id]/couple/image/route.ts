import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
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
    const { field, url } = body;
    const errors = [];

    const allowedFields = ["groomImage", "brideImage"];
    if (!field)
      errors.push({
        field: "field",
        message: "Kolom harus diisi.",
      });
    if (!url)
      errors.push({
        field: "url",
        message: "Url harus diisi.",
      });
    if (!allowedFields.includes(field)) {
      errors.push({
        field: "field",
        message: "Kolom tidak sesuai.",
      });
    }

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const invitationByUserId = await prisma.invitation.findFirst({
      where: { id: params.id, userId },
      include: { couple: true },
    });

    if (!invitationByUserId)
      return ResponseJson("Unauthorized", { status: 401 });

    type CoupleImageField = "groomImage" | "brideImage";
    const existingImage =
      invitationByUserId.couple?.[field as CoupleImageField];

    if (existingImage && existingImage !== url) {
      const publicId = extractCloudinaryPublicId(existingImage);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const updatedCouple = await prisma.couple.upsert({
      where: { invitationId: params.id },
      update: { [field]: url },
      create: {
        invitationId: params.id,
        groomImage: field === "groomImage" ? url : "",
        groomName: "",
        groomFather: "",
        groomMother: "",
        brideImage: field === "brideImage" ? url : "",
        brideName: "",
        brideFather: "",
        brideMother: "",
      },
    });

    return ResponseJson(updatedCouple, { status: 200 });
  } catch (error) {
    console.error("Error updating couple image:", error);
    return ResponseJson(
      { message: "Gagal update foto pengantin." },
      { status: 500 }
    );
  }
}
