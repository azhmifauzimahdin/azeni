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
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
        params.id
      );
    let invitation;
    if (isUUID) {
      invitation = await prisma.invitation.findUnique({
        where: { id: params.id },
        include: {
          transaction: {
            include: {
              status: true,
              webhookLogs: {
                orderBy: {
                  eventAt: "desc",
                },
              },
              referralCode: true,
            },
          },
          music: true,
          theme: {
            include: {
              category: true,
            },
          },
          quote: true,
          schedules: {
            orderBy: {
              startDate: "asc",
            },
          },
          couple: true,
          stories: {
            orderBy: {
              date: "asc",
            },
          },
          galleries: {
            orderBy: {
              createdAt: "asc",
            },
          },
          bankaccounts: {
            include: {
              bank: true,
            },
          },
          comments: {
            include: {
              guest: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          setting: true,
        },
      });
    } else {
      invitation = await prisma.invitation.findFirst({
        where: {
          slug: params.id,
        },
        include: {
          transaction: {
            include: {
              status: true,
              webhookLogs: {
                orderBy: {
                  eventAt: "desc",
                },
              },
              referralCode: true,
            },
          },
          music: true,
          theme: {
            include: {
              category: true,
            },
          },
          quote: true,
          schedules: {
            orderBy: {
              startDate: "asc",
            },
          },
          couple: true,
          stories: {
            orderBy: {
              date: "asc",
            },
          },
          galleries: {
            orderBy: {
              createdAt: "asc",
            },
          },
          bankaccounts: {
            include: {
              bank: true,
            },
          },
          comments: {
            include: {
              guest: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          setting: true,
        },
      });
    }

    const guest = invitation
      ? await prisma.guest.findFirst({
          where: {
            invitationId: invitation.id,
            code: params.guestId,
          },
        })
      : null;

    const dataWithGuest = {
      ...invitation,
      guest: guest ?? null,
    };

    return ResponseJson(
      {
        message: "Data undangan berhasil diambil",
        data: dataWithGuest,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil undangan");
  }
}
