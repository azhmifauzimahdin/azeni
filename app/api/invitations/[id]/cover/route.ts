import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { InvitationSchema } from "@/lib/schemas";
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

export async function PATCH(
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
  const parsed = InvitationSchema.updateImageInvitationSchema.safeParse(body);

  if (!parsed.success) {
    return handleZodError(parsed.error);
  }

  const { image } = parsed.data;

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

    const existingImage = invitationByUserId.image;

    if (existingImage && existingImage !== image) {
      if (existingImage.startsWith("https://res.cloudinary.com/")) {
        const publicId = extractCloudinaryPublicId(existingImage);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    const imageInvitation = await prisma.invitation.update({
      where: {
        id: params.id,
        ...(role !== "admin" && { userId }),
      },
      data: {
        image,
      },
    });

    return ResponseJson(
      {
        message: "Cover undangan berhasil diubah",
        data: imageInvitation,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengubah cover undangan");
  }
}
