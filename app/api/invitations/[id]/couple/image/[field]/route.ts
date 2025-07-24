import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import {
  expiredInvitationError,
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { isBefore } from "date-fns";
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
    if (!userId) return unauthorizedError();

    const allowedFields = ["groomImage", "brideImage"];
    const fieldErrors: Record<string, string[]> = {};

    if (!params.field) {
      fieldErrors["field"] = ["Kolom harus diisi."];
    } else if (!allowedFields.includes(params.field)) {
      fieldErrors["field"] = ["Kolom tidak sesuai."];
    }

    if (Object.keys(fieldErrors).length > 0) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: fieldErrors,
        },
        { status: 422 }
      );
    }

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        couple: true,
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

    return ResponseJson(
      {
        message: "Data gambar pasangan berhasil direset",
        data: couple,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal reset gambar pasangan");
  }
}
