import { prisma } from "@/lib/prisma";
import { handleError, ResponseJson } from "@/lib/utils/response";

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
      where: { id: params.guestId, invitationId: params.id },
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
