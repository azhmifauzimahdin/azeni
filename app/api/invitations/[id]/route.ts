import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import {
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";

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
      });
    } else {
      invitation = await prisma.invitation.findFirst({
        where: {
          slug: params.id,
          expiresAt: {
            gt: new Date(),
          },
        },
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
          setting: true,
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

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

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

    const invitation = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        ...(role !== "admin" && { userId }),
      },
      include: {
        couple: true,
        stories: true,
        galleries: true,
        transaction: {
          include: {
            status: true,
          },
        },
      },
    });

    if (!invitation) return forbiddenError();
    const transactionStatus = invitation.transaction?.status?.name;
    if (transactionStatus !== "SUCCESS") {
      return unpaidInvitationError();
    }

    const urlsToDelete: string[] = [
      invitation.image,
      invitation.couple?.groomImage,
      invitation.couple?.brideImage,
      ...invitation.stories.map((s) => s.image),
      ...invitation.galleries.map((g) => g.image),
    ].filter(Boolean) as string[];

    for (const url of urlsToDelete) {
      const publicId = extractCloudinaryPublicId(url);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch {
          console.warn("Gagal hapus gambar:", publicId);
        }
      }
    }

    await prisma.invitation.delete({
      where: { id: params.id },
    });

    return ResponseJson(
      { message: "Data undangan berhasil dihapus", data: invitation },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus undangan");
  }
}
