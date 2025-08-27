import { prisma } from "@/lib/prisma";
import { LiveStreamingSchema } from "@/lib/schemas";
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
import { isBefore } from "date-fns";

export async function POST(
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
    const parsed =
      LiveStreamingSchema.createApiLiveStreamSchema.safeParse(body);

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
        { status: 422 }
      );
    }

    const {
      startDate,
      endDate,
      description,
      urlYoutube,
      urlInstagram,
      urlFacebook,
      urlTiktok,
      urlZoom,
      urlCustom,
    } = parsed.data;

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

    const existing = await prisma.couple.findUnique({
      where: { invitationId: params.id },
    });

    const liveStream = await prisma.liveStream.upsert({
      where: { invitationId: params.id },
      update: {
        startDate,
        endDate,
        description,
        urlYoutube,
        urlInstagram,
        urlFacebook,
        urlTiktok,
        urlZoom,
        urlCustom,
      },
      create: {
        invitationId: params.id,
        startDate,
        endDate,
        description,
        urlYoutube,
        urlInstagram,
        urlFacebook,
        urlTiktok,
        urlZoom,
        urlCustom,
      },
    });

    const liveStreamEnabled = Boolean(
      urlYoutube ||
        urlInstagram ||
        urlFacebook ||
        urlTiktok ||
        urlZoom ||
        urlCustom
    );

    await prisma.setting.update({
      where: {
        invitationId: params.id,
      },
      data: {
        liveStreamEnabled,
      },
    });

    const isCreate = !existing;

    return ResponseJson(
      {
        message: isCreate
          ? "Data live streaming berhasil dibuat"
          : "Data live streaming berhasil diperbarui",
        data: liveStream,
      },
      { status: isCreate ? 201 : 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat atau memperbarui live streaming");
  }
}
