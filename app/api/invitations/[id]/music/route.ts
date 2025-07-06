import { prisma } from "@/lib/prisma";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export const musicIdSchema = z.object({
  musicId: z
    .string({
      required_error: "ID musik wajib diisi",
      invalid_type_error: "ID musik harus berupa teks",
    })
    .min(1, { message: "ID musik tidak boleh kosong" }),
});
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = musicIdSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    if (!params.id) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            id: ["ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    const { musicId } = parsed.data;

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId) return forbiddenError();

    await prisma.invitation.update({
      where: {
        id: params.id,
      },
      data: {
        musicId,
      },
    });

    const music = await prisma.music.findUnique({
      where: {
        id: musicId,
      },
    });

    return ResponseJson(
      {
        message: "Musik berhasil diperbarui",
        data: music,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui musik");
  }
}
