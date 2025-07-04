import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { unauthorizedError } from "@/lib/utils/unauthorized-error";
import { validationError } from "@/lib/utils/validation-error";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const bodySchema = z.object({
  image: z
    .string({ required_error: "URL gambar wajib diisi" })
    .url("URL gambar tidak valid"),

  description: z.string().optional().default(""),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return unauthorizedError();
  }

  if (!params.id || params.id.trim() === "") {
    return ResponseJson(
      validationError({
        invitationId: ["ID undangan wajib diisi"],
      }),
      { status: 422 }
    );
  }

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return ResponseJson(
      { message: "Validasi gagal", errors: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { image, description } = parsed.data;

  try {
    const InvitaionByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!InvitaionByUserId) return unauthorizedError();

    const gallery = await prisma.gallery.create({
      data: {
        invitationId: params.id,
        image,
        description,
      },
    });

    return ResponseJson(gallery);
  } catch (error) {
    console.error("Error creating gallery item:", error);

    const publicId = extractCloudinaryPublicId(image);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Rolled back Cloudinary image: ${publicId}`);
      } catch (cloudErr) {
        console.error("Gagal hapus gambar Cloudinary:", cloudErr);
      }
    }

    return ResponseJson("Gagal membuat item galeri", { status: 500 });
  }
}
