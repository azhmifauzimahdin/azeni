import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  _: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await auth();

    if (userId !== params.userId) {
      return ResponseJson(
        { message: "Anda tidak memiliki akses ini" },
        { status: 403 }
      );
    }
    const invitation = await prisma.invitation.findMany({
      where: { userId: params.userId },
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
      orderBy: {
        updatedAt: "desc",
      },
    });

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
