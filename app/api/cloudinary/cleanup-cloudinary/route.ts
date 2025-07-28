import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import { handleError } from "@/lib/utils/response";
import { NextResponse } from "next/server";

interface CloudinaryImageResource {
  public_id: string;
  format: string;
  secure_url: string;
  created_at: string;
  [key: string]: unknown;
}

export async function GET() {
  try {
    const cloudinaryResult = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: "users/",
      max_results: 500,
    });

    const cloudinaryResources =
      cloudinaryResult.resources as CloudinaryImageResource[];
    const cloudinaryPublicIds = cloudinaryResources.map((img) => img.public_id);

    const [invitations, stories] = await Promise.all([
      prisma.invitation.findMany({
        where: {
          NOT: [{ image: "" }],
        },
        select: { image: true },
      }),
      prisma.story.findMany({
        where: {
          NOT: [{ image: "" }],
        },
        select: { image: true },
      }),
    ]);

    const dbUrls = [
      ...invitations.map((i) => i.image),
      ...stories.map((s) => s.image),
    ] as string[];

    const usedPublicIds = new Set(
      dbUrls
        .map((url) => extractCloudinaryPublicId(url))
        .filter((id): id is string => Boolean(id))
    );

    const unusedResources = cloudinaryResources
      .filter((res) => !usedPublicIds.has(res.public_id))
      .map((res) => ({
        public_id: res.public_id,
        secure_url: res.secure_url,
      }));

    return NextResponse.json({
      success: true,
      mode: "preview",
      deletedCount: unusedResources.length,
      totalCloudinary: cloudinaryPublicIds.length,
      totalUsedInDB: usedPublicIds.size,
      unusedResources,
    });
  } catch (error) {
    return handleError(error, "Gagal preview file Cloudinary");
  }
}

export async function POST() {
  try {
    const cloudinaryResult = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: "users/",
      max_results: 500,
    });

    const cloudinaryResources =
      cloudinaryResult.resources as CloudinaryImageResource[];
    const cloudinaryPublicIds = cloudinaryResources.map((img) => img.public_id);

    const [invitations, stories] = await Promise.all([
      prisma.invitation.findMany({
        where: {
          NOT: [{ image: "" }],
        },
        select: { image: true },
      }),
      prisma.story.findMany({
        where: {
          NOT: [{ image: "" }],
        },
        select: { image: true },
      }),
    ]);

    const dbUrls = [
      ...invitations.map((i) => i.image),
      ...stories.map((s) => s.image),
    ] as string[];

    const usedPublicIds = new Set(
      dbUrls
        .map((url) => extractCloudinaryPublicId(url))
        .filter((id): id is string => Boolean(id))
    );

    const unusedPublicIds = cloudinaryPublicIds.filter(
      (id) => !usedPublicIds.has(id)
    );

    const deleteResult = unusedPublicIds.length
      ? await cloudinary.api.delete_resources(unusedPublicIds)
      : { deleted: {}, partial: false };

    return NextResponse.json({
      success: true,
      mode: "delete",
      deleted: deleteResult.deleted,
      deletedCount: unusedPublicIds.length,
      totalCloudinary: cloudinaryPublicIds.length,
      totalUsedInDB: usedPublicIds.size,
    });
  } catch (error) {
    return handleError(error, "Gagal menghapus file Cloudinary");
  }
}
