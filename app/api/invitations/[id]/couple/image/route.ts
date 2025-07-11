import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { ImageSchema } from "@/lib/schemas";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = ImageSchema.imageFieldSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }
    if (!params.id) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            id: ["ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    const { field, url } = parsed.data;

    const invitationByUserId = await prisma.invitation.findFirst({
      where: { id: params.id, userId },
      include: { couple: true },
    });

    if (!invitationByUserId) return forbiddenError();

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

    const isCreate =
      updatedCouple.groomName === "" && updatedCouple.brideName === "";

    return ResponseJson(
      {
        message: isCreate
          ? "Gambar pasangan berhasil dibuat"
          : "Gambar pasangan berhasil diperbarui",
        data: updatedCouple,
      },
      { status: isCreate ? 201 : 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat atau memperbarui gambar pasangan");
  }
}
