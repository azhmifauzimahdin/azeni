import { prisma } from "@/lib/prisma";
import { handleError, ResponseJson } from "@/lib/utils/response";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
        params.id
      );
    let invitation;
    if (isUUID) {
      invitation = await prisma.invitation.findUnique({
        where: { id: params.id },
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
              createdAt: "desc",
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
    } else {
      invitation = await prisma.invitation.findUnique({
        where: { slug: params.id },
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
              createdAt: "desc",
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
    }

    if (!invitation) {
      return ResponseJson(
        { message: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    return ResponseJson(
      {
        message: "Data undangan berhasil diambil",
        data: invitation,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil undangan");
  }
}
