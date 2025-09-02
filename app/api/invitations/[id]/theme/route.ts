import { prisma } from "@/lib/prisma";
import { ThemeSchema } from "@/lib/schemas";
import { calculateFinalPrice } from "@/lib/utils/calculate-final-price";
import {
  expiredInvitationError,
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Decimal } from "@prisma/client/runtime/library";
import { isBefore } from "date-fns";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

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
        ...(role !== "admin" && { userId }),
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

    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
      },
      include: {
        category: true,
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

    const referralDiscount =
      invitationByUserId.transaction?.referralDiscountAmount ?? new Decimal(0);

    const amount =
      invitationByUserId.transaction?.amount.add(referralDiscount) ??
      new Decimal(0);

    const finalPrice = calculateFinalPrice(
      theme.originalPrice,
      theme.discount,
      theme.isPercent
    );

    if (!finalPrice.equals(amount)) {
      return ResponseJson(
        {
          message: "Tema memiliki harga yang berbeda",
        },
        { status: 400 }
      );
    }

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
      data: invitation.theme,
    });
  } catch (error) {
    return handleError(error, "Gagal memperbarui tema");
  }
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    const transaction = await prisma.transaction.findFirst({
      where: {
        invitationId: params.id,
        invitation: {
          ...(role !== "admin" && { userId }),
        },
      },
    });

    if (!transaction) {
      return ResponseJson(
        {
          message: "Transaksi tidak ditemukan",
          errors: {
            invitationId: ["Transaksi dengan ID tersebut tidak tersedia"],
          },
        },
        { status: 404 }
      );
    }

    const themes = await prisma.theme.findMany({
      include: {
        category: true,
        invitations: {
          include: {
            guests: {
              take: 1,
              where: { name: "tamu" },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const matchedThemes = themes.filter((theme) => {
      const finalPrice = calculateFinalPrice(
        theme.originalPrice,
        theme.discount,
        theme.isPercent
      );

      const referralDiscount =
        transaction.referralDiscountAmount ?? new Decimal(0);

      const totalAmount = transaction.amount.add(referralDiscount);

      return finalPrice.equals(totalAmount);
    });

    const result = matchedThemes.map((theme) => {
      const matchingInvitation = theme.invitations[0];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { invitations, ...themeWithoutInvitations } = theme;

      if (!matchingInvitation) {
        return {
          ...themeWithoutInvitations,
          invitation: null,
        };
      }

      const { guests, ...invitationWithoutGuests } = matchingInvitation;

      return {
        ...themeWithoutInvitations,
        invitation: {
          ...invitationWithoutGuests,
          guest: guests?.[0] ?? null,
        },
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
