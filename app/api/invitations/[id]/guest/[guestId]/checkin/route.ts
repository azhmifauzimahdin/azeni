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

    if (guest.isCheckedIn) {
      return ResponseJson(
        {
          message: "Tamu sudah melakukan check-in sebelumnya.",
        },
        { status: 400 }
      );
    }

    const updatedGuest = await prisma.guest.update({
      where: {
        id: params.guestId,
      },
      data: {
        isCheckedIn: true,
        checkedInAt: new Date(),
      },
    });

    return ResponseJson(
      {
        message: "Tamu berhasil melakukan check-in.",
        data: {
          id: updatedGuest.id,
          name: updatedGuest.name,
          isCheckedIn: updatedGuest.isCheckedIn,
          checkedInAt: updatedGuest.checkedInAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal melakukan check-in");
  }
}
