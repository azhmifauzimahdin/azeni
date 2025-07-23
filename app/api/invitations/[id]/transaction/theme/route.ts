import { prisma } from "@/lib/prisma";
import { ThemeSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { Decimal } from "@prisma/client/runtime/library";

function calculateFinalPrice(
  originalPrice: Decimal,
  discount: Decimal,
  isPercent: boolean
): Decimal {
  const finalPrice = isPercent
    ? originalPrice.sub(originalPrice.mul(discount).div(100))
    : originalPrice.sub(discount);

  return Decimal.max(new Decimal(0), finalPrice);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = ThemeSchema.patchThemeSchema.safeParse(body);

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

    const { themeId } = parsed.data;

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId) return forbiddenError();

    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
      },
      include: {
        invitations: {
          include: {
            guests: {
              take: 1,
              where: { name: "tamu" },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!theme) {
      return ResponseJson(
        {
          message: "Tema tidak ditemukan",
          errors: {
            themeId: ["Tema dengan ID atau nama tersebut tidak tersedia"],
          },
        },
        { status: 404 }
      );
    }

    const paymentStatus = await prisma.paymentStatus.findFirst({
      where: {
        name: "CREATED",
      },
    });

    if (!paymentStatus) {
      return ResponseJson(
        {
          message: "Status pembayaran tidak ditemukan",
          errors: {
            name: ["Status pembayaran dengan nama tersebut tidak tersedia"],
          },
        },
        { status: 404 }
      );
    }

    const amount = calculateFinalPrice(
      theme.originalPrice,
      theme.discount,
      theme.isPercent
    );

    const transaction = await prisma.transaction.create({
      data: {
        statusId: paymentStatus.id,
        invitationId: invitationByUserId.id,
        invitationSlug: invitationByUserId.slug,
        groomName: invitationByUserId.groom,
        brideName: invitationByUserId.bride,
        originalAmount: theme.originalPrice,
        amount,
        date: new Date(),
      },
      include: {
        status: true,
        webhookLogs: {
          orderBy: {
            eventAt: "desc",
          },
        },
        referralCode: true,
      },
    });

    const invitation = await prisma.invitation.update({
      where: {
        id: params.id,
      },
      data: {
        themeId,
        musicId: theme.invitations[0].musicId,
      },
      include: {
        theme: {
          include: {
            category: true,
          },
        },
      },
    });

    return ResponseJson({
      message: "Tema berhasil diperbarui",
      data: {
        theme: invitation.theme,
        transaction: transaction,
      },
    });
  } catch (error) {
    return handleError(error, "Gagal memperbarui tema");
  }
}
