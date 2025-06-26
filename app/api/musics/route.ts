/* eslint-disable @typescript-eslint/no-explicit-any */
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return ResponseJson({ error: "No file uploaded" }, { status: 400 });
    }

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

    return ResponseJson({ url: result.secure_url });
  } catch (error) {
    return ResponseJson({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const music = await prisma.music.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!music) {
      return ResponseJson(
        { message: "Musik tidak ditemukan" },
        { status: 404 }
      );
    }

    return ResponseJson(music);
  } catch (error) {
    console.error("Error getting music:", error);
    return ResponseJson(
      { message: "Gagal mengambil data musik" },
      { status: 500 }
    );
  }
}
