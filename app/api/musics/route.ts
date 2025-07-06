/* eslint-disable @typescript-eslint/no-explicit-any */
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { MusicSchema } from "@/lib/schemas";
import {
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const rawFile = formData.get("file");

    const parsed = MusicSchema.createMusicSchema.safeParse({ rawFile });

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { file } = parsed.data as { file: File };

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "music",
          format: "mp3",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    return ResponseJson(
      {
        message: "File musik berhasil diunggah",
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat musik");
  }
}

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
