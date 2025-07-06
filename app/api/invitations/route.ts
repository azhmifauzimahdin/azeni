import { generateUniqueSlug } from "@/lib/generateUniqueSlug";
import { prisma } from "@/lib/prisma";
import { InvitationSchema } from "@/lib/schemas";
import {
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
): number {
  const price = originalPrice.toNumber();
  const disc = discount.toNumber();

  const finalPrice = isPercent ? price - (price * disc) / 100 : price - disc;

  return Math.max(0, finalPrice);
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = InvitationSchema.createInvitationSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { groom, bride, slug, themeId, musicId, image, date, expiresAt } =
      parsed.data;

    const unpaidInvitation = await prisma.invitation.findFirst({
      where: {
        userId,
        transaction: {
          status: {
            name: "Menunggu Pembayaran",
          },
        },
      },
    });

    if (unpaidInvitation) {
      return ResponseJson(
        {
          message: "Tidak dapat membuat undangan baru",
          errors: {
            transaction: ["Anda masih memiliki undangan yang belum dibayar"],
          },
        },
        { status: 409 }
      );
    }

    let theme;
    if (!themeId) {
      theme = await prisma.theme.findFirst({
        where: {
          name: "premium-001",
        },
      });
    }

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

    let music;
    if (!musicId) {
      music = await prisma.music.findFirst({
        where: {
          name: "Ketika Cinta Bertasbih - Melly Goeslaw Cover Cindi Cintya Dewi ( Lirik )",
        },
      });
    }

    if (!music) {
      return ResponseJson(
        {
          message: "Musik tidak ditemukan",
          errors: {
            themeId: ["Musik dengan ID atau nama tersebut tidak tersedia"],
          },
        },
        { status: 404 }
      );
    }

    const newSlug = await generateUniqueSlug(slug, "invitation");

    const newInvitation = await prisma.invitation.create({
      data: {
        userId,
        groom,
        bride,
        slug: newSlug,
        themeId: themeId || theme.id,
        musicId: musicId || music.id,
        image,
        status: true,
        date,
        expiresAt,
      },
    });

    const status = await prisma.paymentStatus.findFirst({
      where: {
        name: "Menunggu Pembayaran",
      },
    });

    if (!status) {
      return ResponseJson(
        {
          message: "Status pembayaran tidak ditemukan",
          errors: {
            themeId: [
              "Status pembayaran dengan ID atau nama tersebut tidak tersedia",
            ],
          },
        },
        { status: 404 }
      );
    }

    await prisma.transaction.create({
      data: {
        invitationId: newInvitation.id,
        amount: calculateFinalPrice(
          theme.originalPrice,
          theme.discount,
          theme.isPercent
        ),
        date: new Date(),
        statusId: status.id,
      },
    });

    const invitation = await prisma.invitation.findUnique({
      where: {
        id: newInvitation.id,
      },
      include: {
        transaction: {
          include: {
            status: true,
          },
        },
        music: true,
        theme: true,
        quote: true,
        schedules: {
          orderBy: {
            startDate: "asc",
          },
        },
        couple: true,
        stories: {
          orderBy: {
            createdAt: "desc",
          },
        },
        galleries: {
          orderBy: {
            createdAt: "desc",
          },
        },
        bankaccounts: {
          include: {
            bank: true,
          },
        },
        comments: {
          include: {
            guest: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return ResponseJson(
      {
        message: "Undangan berhasil dibuat",
        data: invitation,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat undangan");
  }
}
