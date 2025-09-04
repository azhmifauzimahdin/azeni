import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { GallerySchema } from "@/lib/schemas";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import {
  expiredInvitationError,
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { validationError } from "@/lib/utils/validation-error";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isBefore } from "date-fns";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return unauthorizedError();
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata.role;

  if (!params.id || params.id.trim() === "") {
    return validationError({
      invitationId: ["ID undangan wajib diisi"],
    });
  }

  const body = await req.json();
  const parsed = GallerySchema.createGallerySchema.safeParse(body);

  if (!parsed.success) {
    return handleZodError(parsed.error);
  }

  const { image, description } = parsed.data;

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
        theme: {
          include: {
            category: true,
          },
        },
        galleries: true,
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

    const themeCategoryName =
      invitationByUserId.theme?.category?.name?.toLowerCase() || "";
    if (themeCategoryName.toLowerCase().includes("tanpa foto")) {
      return ResponseJson(
        {
          message: "Tema ini tidak mendukung upload foto.",
        },
        { status: 403 }
      );
    }

    const maxGalleries =
      invitationByUserId.galleries.length >=
      Number(process.env.NEXT_PUBLIC_MAX_GALLERIES);
    if (maxGalleries) {
      return ResponseJson(
        {
          message: `Batas maksimum galeri tercapai (${process.env.NEXT_PUBLIC_MAX_GALLERIES} foto).`,
        },
        { status: 403 }
      );
    }

    const isCover = invitationByUserId.galleries.length > 0;

    const gallery = await prisma.gallery.create({
      data: {
        invitationId: params.id,
        image,
        description,
        isCover: !isCover,
      },
    });

    return ResponseJson(
      {
        message: "Gallery berhasil dibuat",
        data: gallery,
      },
      { status: 201 }
    );
  } catch (error) {
    const publicId = extractCloudinaryPublicId(image);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Rolled back Cloudinary image: ${publicId}`);
      } catch (cloudErr) {
        console.error("Gagal hapus gambar Cloudinary:", cloudErr);
      }
    }

    return handleError(error, "Gagal membuat galeri");
  }
}
