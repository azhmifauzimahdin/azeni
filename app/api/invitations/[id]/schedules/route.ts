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

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    const body = await req.json();
    const parsed = ScheduleSchema.createApiScheduleSchema.safeParse(body);

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
        invitationId: params.id,
        type: name,
      },
    });

    if (scheduleExists)
      return ResponseJson(
        { message: "Jadwal acara dengan nama yang sama sudah ada." },
        { status: 409 }
      );

    const schedule = await prisma.schedule.create({
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
        message: "Data jadwal acara berhasil dibuat",
        data: schedule,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat jadwal acara");
  }
}
