import { prisma } from "@/lib/prisma";
import { ThemeSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function PUT(
  req: Request,
  { params }: { params: { themeId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const userName =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      user.username ||
      user.emailAddresses?.[0]?.emailAddress ||
      "Tidak diketahui";

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

    const existingTheme = await prisma.theme.findUnique({
      where: { id: params.themeId },
    });

    if (!existingTheme) {
      return ResponseJson({ message: "Tema tidak ditemukan" }, { status: 404 });
    }

    const existingInvitation = await prisma.invitation.findFirst({
      where: { themeId: params.themeId },
      orderBy: { createdAt: "asc" },
    });

    if (!existingInvitation) {
      return ResponseJson(
        { message: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    const existing = await prisma.theme.findFirst({
      where: { name, NOT: { id: params.themeId } },
    });

    if (existing) {
      return ResponseJson({ message: "Tema sudah digunakan" }, { status: 409 });
    }

    await prisma.theme.update({
      where: {
        id: params.themeId,
      },
      data: {
        name,
        thumbnail,
        colorTag,
        originalPrice,
        categoryId,
        discount,
        isPercent,
      },
    });

    await prisma.invitation.update({
      where: {
        id: existingInvitation.id,
      },
      data: {
        userId,
        groom,
        bride,
        slug,
        image,
        musicId,
        date,
        expiresAt,
      },
    });

    const isIsOriginalPriceChanged =
      originalPrice !== Number(existingTheme.originalPrice);
    const isDiscountChanged = discount !== Number(existingTheme.discount);
    const isIsPercentChanged = isPercent !== existingTheme.isPercent;

    if (isIsOriginalPriceChanged || isDiscountChanged || isIsPercentChanged) {
      await prisma.themeLog.create({
        data: {
          userId,
          userName,
          themeId: params.themeId,
          oldOriginalPrice: isIsOriginalPriceChanged
            ? existingTheme.originalPrice
            : null,
          newOriginalPrice: isIsOriginalPriceChanged ? originalPrice : null,
          oldDiscount: isDiscountChanged ? existingTheme.discount : null,
          newDiscount: isDiscountChanged ? discount : null,
          oldIsPercent: isIsPercentChanged ? existingTheme.isPercent : null,
          newIsPercent: isIsPercentChanged ? isPercent : null,
        },
      });
    }

    const updatedTheme = await prisma.theme.findUnique({
      where: {
        id: params.themeId,
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

    const result = updatedTheme
      ? (() => {
          const invitation = updatedTheme.invitations?.[0] ?? null;
          const guest = invitation?.guests?.[0] ?? null;

          const { invitations: _invitations, ...themeWithoutInvitations } =
            updatedTheme;

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
        message: "Data tema berhasil diperbarui",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui tema");
  }
}
export async function DELETE(
  _: Request,
  { params }: { params: { themeId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const theme = await prisma.theme.findUnique({
      where: { id: params.themeId },
    });

    if (!theme) {
      return ResponseJson({ message: "Tema tidak ditemukan" }, { status: 404 });
    }

    await prisma.theme.delete({
      where: { id: params.themeId },
    });

    return ResponseJson(
      { message: "Data ema berhasil dihapus", data: theme },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus tema");
  }
}
