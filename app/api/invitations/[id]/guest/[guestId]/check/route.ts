import { prisma } from "@/lib/prisma";
import {
  expiredInvitationError,
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isBefore } from "date-fns";

export async function PUT(
  req: Request,
  { params }: { params: { id: string; guestId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

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
            code: ["Kode tamu wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

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

    const defaultGuest = await prisma.guest.findFirst({
      where: {
        invitationId: params.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const guest = await prisma.guest.findUnique({
      where: {
        code: params.guestId,
      },
    });

    if (!guest || !defaultGuest) {
      return ResponseJson(
        {
          message: "Tamu tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    if (guest.id === defaultGuest.id) {
      return ResponseJson(
        { message: "Gagal check-out tamu default" },
        { status: 400 }
      );
    }

    if (!guest.isCheckedIn || !guest.checkedInAt) {
      const checkInGuest = await prisma.guest.update({
        where: {
          code: params.guestId,
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
            id: checkInGuest.id,
            name: checkInGuest.name,
            date: checkInGuest.checkedInAt,
            status: "checkin",
          },
        },
        { status: 200 }
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

    const checkOutGuest = await prisma.guest.update({
      where: {
        code: params.guestId,
      },
      data: {
        checkedOutAt: new Date(),
      },
    });

    return ResponseJson(
      {
        message: "Tamu berhasil melakukan check-out.",
        data: {
          id: checkOutGuest.id,
          name: checkOutGuest.name,
          date: checkOutGuest.checkedOutAt,
          status: "checkout",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal melakukan check-out");
  }
}
