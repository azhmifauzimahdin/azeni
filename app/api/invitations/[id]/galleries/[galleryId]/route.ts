import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import cloudinary from "@/lib/cloudinary";
import {
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; galleryId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return unauthorizedError();
  }

  try {
    const InvitaionByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!InvitaionByUserId) return forbiddenError();

    const deleted = await prisma.gallery.delete({
      where: { id: params.galleryId },
    });

    const publicId = extractCloudinaryPublicId(deleted.image);
    if (!publicId) throw new Error("public_id tidak ditemukan");

    await cloudinary.uploader.destroy(publicId);

    return ResponseJson(
      {
        message: "Galeri berhasil dihapus",
        data: deleted,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal hapus galeri");
  }
}
