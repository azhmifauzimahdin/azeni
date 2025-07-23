import { prisma } from "@/lib/prisma";
import { SettingSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
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
    const parsed = SettingSchema.createApiRSVPSchema.safeParse(body);

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

    const { rsvpEnabled, rsvpMaxGuests, rsvpDeadline, rsvpAllowNote } =
      parsed.data;

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

    const setting = await prisma.setting.update({
      where: {
        invitationId: params.id,
      },
      data: {
        rsvpEnabled,
        rsvpMaxGuests,
        rsvpDeadline,
        rsvpAllowNote,
      },
    });

    return ResponseJson(
      {
        message: "Data pengaturan RSVP berhasil diperbarui",
        data: setting,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui pengaturan RSVP");
  }
}
