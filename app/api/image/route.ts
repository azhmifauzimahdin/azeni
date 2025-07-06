import crypto from "crypto";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import {
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { ImageSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return unauthorizedError();

  const body = await req.json();
  const params = body.paramsToSign;

  const sortedKeys = Object.keys(params).sort();
  const stringToSign = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(stringToSign + process.env.CLOUDINARY_API_SECRET!)
    .digest("hex");

  return ResponseJson({
    message: "Signature berhasil dibuat",
    data: {
      signature,
      stringToSign,
      timestamp: params.timestamp,
    },
  });
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = ImageSchema.deleteImageSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { public_id } = parsed.data;

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok") {
      return ResponseJson(
        {
          message: "Gagal menghapus gambar dari Cloudinary",
          detail: result.result,
        },
        { status: 400 }
      );
    }

    return ResponseJson({
      message: "Gambar berhasil dihapus dari Cloudinary",
      data: {
        result: result.result,
      },
    });
  } catch (error) {
    return handleError(error, "Gagal hapus gambar");
  }
}
