import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { unauthorizedError } from "@/lib/utils/unauthorized-error";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import cloudinary from "@/lib/cloudinary";

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

    if (!InvitaionByUserId) return unauthorizedError();

    const deleted = await prisma.gallery.delete({
      where: { id: params.galleryId },
    });

    const publicId = extractCloudinaryPublicId(deleted.image);
    if (!publicId) throw new Error("public_id tidak ditemukan");

    await cloudinary.uploader.destroy(publicId);

    return ResponseJson(deleted);
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return ResponseJson({ message: "Gagal hapus galeri." }, { status: 500 });
  }
}
