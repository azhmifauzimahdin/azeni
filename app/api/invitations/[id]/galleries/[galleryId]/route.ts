import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import cloudinary from "@/lib/cloudinary";
import {
  expiredInvitationError,
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { isBefore } from "date-fns";

export async function PATCH(
  _: Request,
  { params }: { params: { id: string; galleryId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return unauthorizedError();
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata.role;

  try {
    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        ...(role !== "admin" && { userId }),
      },
      include: {
        transaction: {
          include: {
            status: true,
          },
        },
      },
    });

    if (!invitationByUserId) return forbiddenError();
    const transactionStatus = invitationByUserId.transaction?.status?.name;
    if (transactionStatus !== "SUCCESS") {
      return unpaidInvitationError();
    }
    const now = new Date();
    if (isBefore(invitationByUserId.expiresAt, now)) {
      return expiredInvitationError();
    }

    const [, , galleries] = await prisma.$transaction([
      prisma.gallery.updateMany({
        where: { invitationId: params.id },
        data: { isCover: false },
      }),
      prisma.gallery.update({
        where: { id: params.galleryId },
        data: { isCover: true },
      }),
      prisma.gallery.findMany({
        where: { invitationId: params.id },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    return ResponseJson(
      {
        message: "Gambar utama berhasil diubah",
        data: galleries,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal ubah gambar utama");
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; galleryId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return unauthorizedError();
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata.role;

  try {
    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        ...(role !== "admin" && { userId }),
      },
    });

    if (!invitationByUserId) return forbiddenError();

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
