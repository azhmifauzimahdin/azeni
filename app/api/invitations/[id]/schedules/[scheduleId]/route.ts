import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string; scheduleId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const body = await req.json();

    const { name, startDate, endDate, timezone, location, locationMaps } = body;

    const errors = [];
    if (!name) errors.push({ field: "name", message: "Quote harus diisi." });
    if (!startDate)
      errors.push({
        field: "startDate",
        message: "Tanggal mulai harus diisi.",
      });
    if (!endDate)
      errors.push({
        field: "endDate",
        message: "Tanggal selesai harus diisi.",
      });
    if (!timezone)
      errors.push({
        field: "timezone",
        message: "Zona waktu harus diisi.",
      });
    if (!location)
      errors.push({ field: "location", message: "Lokasi harus diisi." });
    if (!locationMaps)
      errors.push({
        field: "locationMaps",
        message: "Maps lokasi harus diisi.",
      });
    if (!params.id)
      errors.push({
        field: "invitationId",
        message: "Invitation ID harus diisi.",
      });
    if (!params.scheduleId)
      errors.push({
        field: "scheduleId",
        message: "Schedule ID harus diisi.",
      });

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId)
      return ResponseJson("Unauthorized", { status: 401 });

    const scheduleExists = await prisma.schedule.findFirst({
      where: {
        id: { not: params.scheduleId },
        invitationId: params.id,
        type: name,
      },
    });

    if (scheduleExists)
      return ResponseJson("Jadwal acara dengan nama yang sama sudah ada.", {
        status: 409,
      });

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

    return ResponseJson(schedule, { status: 201 });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return ResponseJson(
      { message: "Gagal ubah jadwal acara." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string; scheduleId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const errors = [];
    if (!params.id)
      errors.push({
        field: "invitationId",
        message: "Invitation ID harus diisi.",
      });
    if (!params.scheduleId)
      errors.push({
        field: "scheduleId",
        message: "Schedule ID harus diisi.",
      });

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const InvitaionByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!InvitaionByUserId)
      return ResponseJson("Unauthorized", { status: 401 });

    const schedule = await prisma.schedule.delete({
      where: {
        id: params.scheduleId,
      },
    });

    return ResponseJson(schedule, { status: 200 });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return ResponseJson(
      { message: "Gagal hapus jadwal acara." },
      { status: 500 }
    );
  }
}
