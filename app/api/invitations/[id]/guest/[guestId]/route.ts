import { prisma } from "@/lib/prisma";
import { GuestSchema } from "@/lib/schemas";
import {
  expiredInvitationError,
  forbiddenError,
  handleError,
  handleZodError,
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

    const body = await req.json();
    const parsed = GuestSchema.updateGuestSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

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

    const { name, group, address } = parsed.data;

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

    const guest = await prisma.guest.update({
      where: {
        id: params.guestId,
      },
      data: {
        name,
        group,
        address,
      },
    });

    return ResponseJson(
      {
        message: "Data tamu berhasil diperbarui",
        data: guest,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui tamu");
  }
}

export async function DELETE(
  _: Request,
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

    const guest = await prisma.guest.delete({
      where: {
        id: params.guestId,
      },
    });

    return ResponseJson(
      { message: "Data tamu berhasil dihapus", data: guest },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus tamu");
  }
}

export async function GET(
  _: Request,
  { params }: { params: { id: string; guestId: string } }
) {
  try {
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
            guestId: ["ID tamu wajib diisi"],
          },
        },
        { status: 400 }
      );
    }
    const guest = await prisma.guest.findUnique({
      where: { code: params.guestId, invitationId: params.id },
    });

    if (!guest) {
      return ResponseJson(
        {
          message: "Tamu tidak ditemukan",
          errors: {
            guestId: ["Tamu tidak ditemukan atau tidak valid"],
          },
        },
        { status: 404 }
      );
    }

    return ResponseJson(
      {
        message: "Data tamu berhasil diambil",
        data: guest,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil tamu");
  }
}
