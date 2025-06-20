import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { ResponseJson } from "@/lib/utils/response-with-wib";

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
