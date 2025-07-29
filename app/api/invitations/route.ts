import { generateUniqueSlug } from "@/lib/generateUniqueSlug";
import { prisma } from "@/lib/prisma";
import { InvitationSchema } from "@/lib/schemas";
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
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const invitations = await prisma.invitation.findMany({
      where: {
        isTemplate: false,
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

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = InvitationSchema.createInvitationSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { groom, bride, slug, image, date, expiresAt } = parsed.data;

    const unpaidInvitation = await prisma.invitation.findFirst({
      where: {
        userId,
        OR: [
          {
            transaction: null,
          },
          {
            transaction: {
              status: {
                name: {
                  in: ["PENDING", "CREATED"],
                },
              },
            },
          },
        ],
      },
    });

    if (unpaidInvitation) {
      return ResponseJson(
        {
          message: "Tidak dapat membuat undangan baru",
          errors: {
            transaction: [
              "Anda masih memiliki undangan yang belum diselesaikan",
            ],
          },
        },
        { status: 409 }
      );
    }

    const newSlug = await generateUniqueSlug(slug, "invitation");

    const newInvitation = await prisma.invitation.create({
      data: {
        userId,
        groom,
        bride,
        slug: newSlug,
        image,
        status: true,
        date,
        expiresAt,
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
    });

    return ResponseJson(
      {
        message: "Undangan berhasil dibuat",
        data: newInvitation,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat undangan");
  }
}
