import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";

export async function GET(
  _: Request,
  { params }: { params: { id: string; guestId: string } }
) {
  try {
    const guest = await prisma.guest.findUnique({
      where: { id: params.guestId, invitationId: params.id },
    });

    if (!guest) {
      return ResponseJson({ message: "Tamu tidak ditemukan" }, { status: 404 });
    }

    return ResponseJson(guest);
  } catch (error) {
    console.error(error);
    return ResponseJson({ message: "Gagal mengambil data" }, { status: 500 });
  }
}
