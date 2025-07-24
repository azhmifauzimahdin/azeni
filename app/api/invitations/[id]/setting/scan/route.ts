import { prisma } from "@/lib/prisma";
import { SettingSchema } from "@/lib/schemas";
import {
  expiredInvitationError,
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { isBefore } from "date-fns";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed =
      SettingSchema.scanResetCountdownSecondsSchema.safeParse(body);

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

    const { scanResetCountdownSeconds } = parsed.data;

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
    const now = new Date();
    if (isBefore(invitationByUserId.expiresAt, now)) {
      return expiredInvitationError();
    }

    const setting = await prisma.setting.update({
      where: {
        invitationId: params.id,
      },
      data: {
        scanResetCountdownSeconds,
      },
    });

    return ResponseJson(
      {
        message: "Waktu otomatis tutup scan undangan berhasil diperbarui",
        data: setting,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(
      error,
      "Gagal memperbarui waktu otomatis tutup scan undangan"
    );
  }
}
