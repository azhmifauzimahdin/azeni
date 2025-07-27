import { generateUniqueSlug } from "@/lib/generateUniqueSlug";
import { prisma } from "@/lib/prisma";
import { ThemeSchema } from "@/lib/schemas";
import { calculateFinalPrice } from "@/lib/utils/calculate-final-price";
import { defaultWhatsappMessageTemplate } from "@/lib/utils/default";
import { generateUniqueGuestCode } from "@/lib/utils/generate-unique-guest-code";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const themes = await prisma.theme.findMany({
      include: {
        category: true,
        invitations: {
          include: {
            guests: {
              take: 1,
              orderBy: { createdAt: "asc" },
            },
            transaction: {
              include: {
                status: true,
                webhookLogs: {
                  orderBy: {
                    eventAt: "desc",
                  },
                },
                referralCode: true,
              },
            },
            music: true,
            theme: {
              include: {
                category: true,
              },
            },
            quote: true,
            schedules: {
              orderBy: {
                startDate: "asc",
              },
            },
            couple: true,
            stories: {
              orderBy: {
                date: "asc",
              },
            },
            galleries: {
              orderBy: {
                createdAt: "asc",
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
            setting: true,
          },
          take: 1,
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = themes.map((theme) => {
      const invitation = theme.invitations[0] ?? null;
      const guest = invitation?.guests?.[0] ?? null;

      const { invitations: _invitations, ...themeWithoutInvitations } = theme;

      return {
        ...themeWithoutInvitations,
        invitation: invitation
          ? {
              ...Object.fromEntries(
                Object.entries(invitation).filter(([key]) => key !== "guests")
              ),
              guest,
            }
          : null,
      };
    });

    return ResponseJson(
      {
        message: "Data tema berhasil diambil",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil tema");
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const body = await req.json();
    const parsed = ThemeSchema.createThemeSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const {
      name,
      thumbnail,
      colorTag,
      originalPrice,
      categoryId,
      discount,
      isPercent,
      groom,
      bride,
      slug,
      image,
      musicId,
      date,
      expiresAt,
    } = parsed.data;

    const themeCategory = await prisma.themeCategory.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!themeCategory) {
      return ResponseJson(
        {
          message: "Kategori tema tidak ditemukan",
          errors: {
            categoriId: ["Kategori tema dengan ID tersebut tidak tersedia"],
          },
        },
        { status: 404 }
      );
    }

    const paymentStatus = await prisma.paymentStatus.findFirst({
      where: {
        name: "SUCCESS",
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

    const existing = await prisma.theme.findFirst({
      where: { name },
    });

    if (existing) {
      return ResponseJson(
        { message: "Nama tema sudah digunakan" },
        { status: 409 }
      );
    }

    const theme = await prisma.theme.create({
      data: {
        name,
        thumbnail,
        categoryId,
        colorTag,
        originalPrice,
        discount,
        isPercent,
      },
    });

    const newSlug = await generateUniqueSlug(slug, "invitation");

    const invitation = await prisma.invitation.create({
      data: {
        userId,
        groom,
        bride,
        slug: newSlug,
        themeId: theme.id,
        musicId: musicId,
        image,
        status: true,
        date,
        isTemplate: true,
        expiresAt,
      },
    });

    const amount = calculateFinalPrice(
      theme.originalPrice,
      theme.discount,
      theme.isPercent
    );

    await prisma.transaction.create({
      data: {
        statusId: paymentStatus.id,
        invitationId: invitation.id,
        invitationSlug: invitation.slug,
        groomName: invitation.groom,
        brideName: invitation.bride,
        originalAmount: theme.originalPrice,
        amount,
        date: new Date(),
      },
    });

    await prisma.setting.create({
      data: {
        invitationId: invitation.id,
        whatsappMessageTemplate: defaultWhatsappMessageTemplate,
      },
    });

    const kode = await generateUniqueGuestCode();

    await prisma.guest.create({
      data: {
        code: kode,
        invitationId: invitation.id,
        name: "tamu",
        isAttending: false,
        color: "bg-teal-500",
      },
    });

    const newTheme = await prisma.theme.findFirst({
      where: {
        id: theme.id,
      },
      include: {
        category: true,
        invitations: {
          include: {
            guests: {
              take: 1,
              orderBy: { createdAt: "asc" },
            },
            transaction: {
              include: {
                status: true,
                webhookLogs: {
                  orderBy: {
                    eventAt: "desc",
                  },
                },
                referralCode: true,
              },
            },
            music: true,
            theme: {
              include: {
                category: true,
              },
            },
            quote: true,
            schedules: {
              orderBy: {
                startDate: "asc",
              },
            },
            couple: true,
            stories: {
              orderBy: {
                date: "asc",
              },
            },
            galleries: {
              orderBy: {
                createdAt: "asc",
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
            setting: true,
          },
          take: 1,
          orderBy: { createdAt: "asc" },
        },
      },
    });

    const result = newTheme
      ? (() => {
          const invitation = newTheme.invitations?.[0] ?? null;
          const guest = invitation?.guests?.[0] ?? null;

          const { invitations: _invitations, ...themeWithoutInvitations } =
            newTheme;

          return {
            ...themeWithoutInvitations,
            invitation: invitation
              ? {
                  ...Object.fromEntries(
                    Object.entries(invitation).filter(
                      ([key]) => key !== "guests"
                    )
                  ),
                  guest,
                }
              : null,
          };
        })()
      : null;

    return ResponseJson(
      {
        message: "Tema berhasil dibuat",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat tema");
  }
}
