import { prisma } from "@/lib/prisma";
import {
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  _: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return unauthorizedError();
    }

    if (userId !== params.userId) {
      return forbiddenError();
    }

    const invitations = await prisma.invitation.findMany({
      where: { userId: params.userId },
      include: {
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
        guests: {
          orderBy: {
            createdAt: "desc",
          },
        },
        setting: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return ResponseJson(
      {
        message: "Data undangan berhasil diambil",
        data: invitations,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil undangan");
  }
}
