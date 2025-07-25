/* eslint-disable @typescript-eslint/no-explicit-any */
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { MusicSchema } from "@/lib/schemas";
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

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const music = await prisma.music.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return ResponseJson(
      {
        message: "Data musik berhasil diambil",
        data: music,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil musik");
  }
}

export async function POST(req: Request) {
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

    const music = await prisma.music.create({
      data: {
        name,
        src: result.secure_url,
        origin,
        visibility,
      },
    });

    return ResponseJson(
      {
        message: "File musik berhasil diunggah",
        data: music,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat musik");
  }
}
