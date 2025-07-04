import { generateUniqueSlug } from "@/lib/generateUniqueSlug";
import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
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
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const body = await req.json();

    const { groom, bride, slug, themeId, musicId, image, date, expiresAt } =
      body;

    const errors = [];
    if (!groom)
      errors.push({
        field: "groom",
        message: "Nama panggilan pria harus diisi.",
      });
    if (!bride)
      errors.push({
        field: "bride",
        message: "Nama panggilan wanita harus diisi.",
      });
    if (!slug) errors.push({ field: "slug", message: "Slug harus diisi." });
    if (!date) errors.push({ field: "date", message: "Tanggal harus diisi." });
    if (!expiresAt)
      errors.push({
        field: "expiresAt",
        message: "Tanggal berlaku harus diisi.",
      });

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

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
        { message: "Anda masih memiliki undangan yang belum dibayar" },
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
      return ResponseJson({ message: "Tema tidak ditemukan" }, { status: 404 });
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
        { message: "Musik tidak ditemukan" },
        { status: 404 }
      );
    }

    const newSlug = await generateUniqueSlug(slug, "invitation");

    const invitation = await prisma.invitation.create({
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
        { message: "Status pembayaran tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.transaction.create({
      data: {
        invitationId: invitation.id,
        amount: calculateFinalPrice(
          theme.originalPrice,
          theme.discount,
          theme.isPercent
        ),
        date: new Date(),
        statusId: status.id,
      },
    });

    const newInvitation = await prisma.invitation.findUnique({
      where: {
        id: invitation.id,
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
    return ResponseJson(newInvitation, { status: 201 });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return ResponseJson(
      { message: "Gagal membuat undangan." },
      { status: 500 }
    );
  }
}
