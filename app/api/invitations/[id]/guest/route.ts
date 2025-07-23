import { prisma } from "@/lib/prisma";
import { GuestSchema } from "@/lib/schemas";
import { generateUniqueGuestCode } from "@/lib/utils/generate-unique-guest-code";
import { getRandomBgColor } from "@/lib/utils/random-bg-color";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
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
    const parsed = GuestSchema.createGuestSchema.safeParse(body);

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

    const { name, group, address } = parsed.data;

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

    const code = await generateUniqueGuestCode();
    const color = getRandomBgColor();

    const guest = await prisma.guest.create({
      data: {
        code,
        invitationId: params.id,
        name,
        group,
        address,
        color,
      },
    });

    const existingInvitationChange = await prisma.invitationChange.findFirst({
      where: {
        invitationId: params.id,
        type: "guest",
      },
    });

    if (!existingInvitationChange) {
      await prisma.invitationChange.create({
        data: {
          invitationId: params.id,
          type: "guest",
        },
      });
    }

    return ResponseJson(
      {
        message: "Data tamu berhasil dibuat",
        data: guest,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat tamu");
  }
}
