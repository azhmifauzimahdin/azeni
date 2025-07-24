import { prisma } from "@/lib/prisma";
import { StorySchema } from "@/lib/schemas";
import {
  expiredInvitationError,
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { isBefore } from "date-fns";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = StorySchema.createApiStorySchema.safeParse(body);

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

    const { title, date, description, image } = parsed.data;

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
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

    const sotryExists = await prisma.story.findFirst({
      where: {
        invitationId: params.id,
        title,
      },
    });

    if (sotryExists)
      return ResponseJson(
        { message: "Cerita dengan nama yang sama sudah ada." },
        { status: 409 }
      );

    const story = await prisma.story.create({
      data: {
        title,
        date,
        description,
        image: image,
        invitationId: params.id,
      },
    });

    return ResponseJson(
      {
        message: "Data cerita berhasil dibuat",
        data: story,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat cerita");
  }
}
