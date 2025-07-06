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

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

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
        userId,
      },
    });

    if (!invitationByUserId) return forbiddenError();

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
