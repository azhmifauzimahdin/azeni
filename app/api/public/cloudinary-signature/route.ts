import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { ResponseJson, unauthorizedError } from "@/lib/utils/response";

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
