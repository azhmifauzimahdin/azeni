import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  {
    params,
  }: {
    params: { id: string; field: string };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const errors = [];

    const allowedFields = ["groomImage", "brideImage"];
    if (!params.field)
      errors.push({
        params: "field",
        message: "Kolom harus diisi.",
      });
    if (!allowedFields.includes(params.field)) {
      errors.push({
        field: "field",
        message: "Kolom tidak sesuai.",
      });
    }

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        couple: true,
      },
    });

    if (!invitationByUserId)
      return ResponseJson("Unauthorized", { status: 401 });

    type CoupleImageField = "groomImage" | "brideImage";
    const existingImage =
      invitationByUserId.couple?.[params.field as CoupleImageField];

    if (existingImage) {
      const publicId = extractCloudinaryPublicId(existingImage);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const couple = await prisma.couple.update({
      where: {
        invitationId: params.id,
      },
      data: {
        [params.field]: "",
      },
    });

    return ResponseJson(couple, { status: 200 });
  } catch (error) {
    console.error("Error deleting couple image:", error);
    return ResponseJson(
      { message: "Gagal hapus foto pengantin." },
      { status: 500 }
    );
  }
}
