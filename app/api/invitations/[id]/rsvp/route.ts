import { prisma } from "@/lib/prisma";
import { RSVPSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
} from "@/lib/utils/response";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = RSVPSchema.rsvpSchema.safeParse(body);

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

    const { guestId, isAttending, totalGuests, notes } = parsed.data;

    const guest = await prisma.guest.findFirst({
      where: {
        id: guestId,
        invitationId: params.id,
      },
    });

    if (!guest) return forbiddenError();

    const setting = await prisma.setting.findFirst({
      where: {
        invitationId: params.id,
      },
    });

    if (!setting) {
      return ResponseJson(
        {
          message: "Pengaturan tidak ditemukan",
          errors: {
            id: ["Pengaturan dengan id tersebut tidak tersedia"],
          },
        },
        { status: 404 }
      );
    }

    if (!setting.rsvpEnabled) {
      return ResponseJson(
        {
          message: "RSVP belum dibuka",
          errors: {
            rsvp: ["RSVP untuk undangan ini belum tersedia."],
          },
        },
        { status: 403 }
      );
    }

    if (setting.rsvpDeadline && new Date() > setting.rsvpDeadline) {
      return ResponseJson(
        {
          message: "RSVP sudah ditutup",
          errors: {
            deadline: ["Batas waktu RSVP telah lewat."],
          },
        },
        { status: 403 }
      );
    }

    if (
      typeof totalGuests === "number" &&
      setting.rsvpMaxGuests &&
      totalGuests > setting.rsvpMaxGuests
    ) {
      return ResponseJson(
        {
          message: "Jumlah tamu melebihi batas",
          errors: {
            totalGuests: [
              `Jumlah tamu maksimal adalah ${setting.rsvpMaxGuests}`,
            ],
          },
        },
        { status: 409 }
      );
    }

    if (!setting.rsvpAllowNote && notes) {
      return ResponseJson(
        {
          message: "Catatan tidak diperbolehkan",
          errors: {
            notes: ["Pengisian catatan tidak diizinkan pada undangan ini."],
          },
        },
        { status: 403 }
      );
    }

    const updatedGuest = await prisma.guest.update({
      where: {
        id: guest.id,
      },
      data: {
        isAttending,
        totalGuests: isAttending ? totalGuests : 0,
        notes: setting.rsvpAllowNote ? notes : null,
      },
    });

    return ResponseJson(
      {
        message: "RSVP berhasil dibuat",
        data: updatedGuest,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat RSVP");
  }
}
