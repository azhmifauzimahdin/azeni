import crypto from "crypto";
import cloudinary from "@/lib/cloudinary";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return ResponseJson("Unauthorized", { status: 401 });

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

  return ResponseJson({ signature });
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const body = await request.json();
    const { public_id } = body;

    const errors = [];
    if (!public_id) {
      errors.push({ field: "public_id", message: "Public Id harus diisi." });
    }
    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    return ResponseJson(result, { status: 200 });
  } catch (error) {
    console.error("Error deleted image:", error);
    return ResponseJson({ message: "Gagal hapus gambar." }, { status: 500 });
  }
}
