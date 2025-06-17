import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";

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
          transaction: true,
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
    } else {
      invitation = await prisma.invitation.findUnique({
        where: { slug: params.id },
        include: {
          transaction: true,
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

    return ResponseJson(invitation);
  } catch (error) {
    console.error(error);
    return ResponseJson({ message: "Gagal mengambil data" }, { status: 500 });
  }
}
