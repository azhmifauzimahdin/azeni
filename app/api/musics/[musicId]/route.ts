import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { MusicSchema } from "@/lib/schemas";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

async function deleteMusicFromCloudinary(url: string) {
  const publicId = extractCloudinaryPublicId(url);
  if (!publicId) return;

  try {
    console.log(publicId);
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (err) {
    console.error("Gagal menghapus musik dari Cloudinary:", err);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { musicId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;
    if (role !== "admin") return forbiddenError();

    const body = await req.json();
    const parsed = MusicSchema.apiMusicSchema.safeParse(body);
    if (!parsed.success) return handleZodError(parsed.error);

    const { name, src, origin, visibility } = parsed.data;

    const existingMusic = await prisma.music.findUnique({
      where: { id: params.musicId },
    });

    if (!existingMusic) {
      return ResponseJson(
        { message: "Musik tidak ditemukan" },
        { status: 404 }
      );
    }

    let newSrc = existingMusic.src;
    const isBase64Audio = /^data:audio\/\w+;base64,/.test(src);

    if (isBase64Audio) {
      await deleteMusicFromCloudinary(existingMusic.src);

      const base64Data = src.replace(/^data:audio\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "music",
            format: "mp3",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result!);
          }
        );

        Readable.from(buffer).pipe(uploadStream);
      });

      newSrc = result.secure_url;
    }

    const music = await prisma.music.update({
      where: { id: params.musicId },
      data: {
        name,
        src: newSrc,
        origin,
        visibility,
      },
    });

    return ResponseJson(
      { message: "Musik berhasil diperbarui", data: music },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui musik");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { musicId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;
    if (role !== "admin") return forbiddenError();

    const music = await prisma.music.findUnique({
      where: { id: params.musicId },
    });

    if (!music) {
      return ResponseJson(
        { message: "Musik tidak ditemukan" },
        { status: 404 }
      );
    }

    if (music.src) {
      await deleteMusicFromCloudinary(music.src);
    }

    await prisma.music.delete({
      where: { id: params.musicId },
    });

    return ResponseJson(
      { message: "Musik berhasil dihapus", data: music },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus musik");
  }
}
