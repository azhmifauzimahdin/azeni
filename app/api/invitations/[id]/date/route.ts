import { prisma } from "@/lib/prisma";
import { InvitationSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed =
      InvitationSchema.updateDateInvitationApiSchema.safeParse(body);

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

    const { date, useScheduleDate } = parsed.data;

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId) return forbiddenError();

    const invitation = await prisma.invitation.update({
      where: {
        id: params.id,
      },
      data: {
        date,
        useScheduleDate,
      },
    });

    return ResponseJson(
      {
        message: "Tanggal undangan berhasil diperbarui",
        data: invitation,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui tanggal undangan");
  }
}
