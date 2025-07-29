import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { StorySchema } from "@/lib/schemas";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
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
import { NextRequest } from "next/server";

async function deleteImageFromCloudinary(url: string) {
  const publicId = extractCloudinaryPublicId(url);
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Gagal menghapus gambar dari Cloudinary:", err);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string; storyId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    const body = await req.json();
    const parsed = StorySchema.updateAPIStorySchema.safeParse(body);

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

    if (!params.storyId) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            storyId: ["Story ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    const { title, date, description, image } = parsed.data;

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

    const storyExists = await prisma.story.findFirst({
      where: {
        id: { not: params.storyId },
        invitationId: params.id,
        title,
      },
    });

    if (storyExists)
      return ResponseJson(
        { message: "Cerita dengan nama yang sama sudah ada." },
        { status: 409 }
      );

    const existingStory = await prisma.story.findUnique({
      where: { id: params.storyId },
    });

    if (!existingStory) {
      return ResponseJson(
        { message: "Cerita tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingStory.image && existingStory.image !== image) {
      await deleteImageFromCloudinary(existingStory.image);
    }

    const updated = await prisma.story.update({
      where: {
        id: params.storyId,
      },
      data: {
        title,
        date,
        description,
        image,
        invitationId: params.id,
      },
    });

    return ResponseJson(
      {
        message: "Cerita acara berhasil diperbarui",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui cerita");
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string; storyId: string } }
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

    if (!params.storyId) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            storyId: ["Story ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

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

    const story = await prisma.story.findUnique({
      where: { id: params.storyId },
    });

    if (!story) {
      return ResponseJson(
        { message: "Cerita tidak ditemukan" },
        { status: 404 }
      );
    }

    if (story.image) {
      await deleteImageFromCloudinary(story.image);
    }

    await prisma.story.delete({
      where: { id: params.storyId },
    });

    return ResponseJson(
      { message: "Data cerita berhasil dihapus", data: story },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus cerita");
  }
}
