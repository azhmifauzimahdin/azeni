import { prisma } from "@/lib/prisma";
import { ScheduleSchema } from "@/lib/schemas";
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
  { params }: { params: { id: string; scheduleId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    const body = await req.json();
    const parsed = ScheduleSchema.updateApiScheduleSchema.safeParse(body);

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

    if (!params.scheduleId) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            scheduleId: ["Schedule ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    const { name, startDate, endDate, timezone, location, locationMaps } =
      parsed.data;

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

    const scheduleExists = await prisma.schedule.findFirst({
      where: {
        id: { not: params.scheduleId },
        invitationId: params.id,
        type: name,
      },
    });

    if (scheduleExists)
      return ResponseJson(
        { message: "Jadwal acara dengan nama yang sama sudah ada." },
        { status: 409 }
      );

    const schedule = await prisma.schedule.update({
      where: {
        id: params.scheduleId,
      },
      data: {
        type: name,
        name:
          name === "marriage"
            ? "Akad Nikah"
            : name === "reception"
            ? "Resepsi"
            : name,
        startDate,
        endDate,
        timezone,
        location,
        locationMaps,
        invitationId: params.id,
      },
    });

    return ResponseJson(
      {
        message: "Data jadwal acara berhasil diperbarui",
        data: schedule,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui jadwal acara");
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; scheduleId: string } }
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

    if (!params.scheduleId) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            scheduleId: ["Schedule ID wajib diisi"],
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

    const schedule = await prisma.schedule.delete({
      where: {
        id: params.scheduleId,
      },
    });

    return ResponseJson(
      { message: "Data jadwal acara berhasil dihapus", data: schedule },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus jadwal acara");
  }
}
