import { prisma } from "@/lib/prisma";
import {
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string; guestId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

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

    if (!params.guestId) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            guestId: ["Guest ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId) return forbiddenError();

    const guest = await prisma.guest.findUnique({
      where: {
        id: params.guestId,
      },
    });

    if (!guest) {
      return ResponseJson(
        {
          message: "Tamu tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    if (!guest.isCheckedIn || !guest.checkedInAt) {
      return ResponseJson(
        {
          message: "Tamu belum melakukan check-in.",
        },
        { status: 400 }
      );
    }

    if (guest.checkedOutAt) {
      return ResponseJson(
        {
          message: "Tamu sudah melakukan check-out sebelumnya.",
        },
        { status: 400 }
      );
    }

    const updatedGuest = await prisma.guest.update({
      where: {
        id: params.guestId,
      },
      data: {
        checkedOutAt: new Date(),
      },
    });

    return ResponseJson(
      {
        message: "Tamu berhasil melakukan check-out.",
        data: {
          id: updatedGuest.id,
          name: updatedGuest.name,
          checkedOutAt: updatedGuest.checkedOutAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal melakukan check-out");
  }
}
