import { prisma } from "@/lib/prisma";
import { ScheduleSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string; scheduleId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

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
        userId,
      },
    });

    if (!invitationByUserId) return forbiddenError();

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
  _: NextRequest,
  { params }: { params: { id: string; scheduleId: string } }
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

    const InvitaionByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!InvitaionByUserId) return forbiddenError();

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
