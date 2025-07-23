import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { GallerySchema } from "@/lib/schemas";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { validationError } from "@/lib/utils/validation-error";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return unauthorizedError();
  }

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
        userId,
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

    const gallery = await prisma.gallery.create({
      data: {
        invitationId: params.id,
        image,
        description,
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
