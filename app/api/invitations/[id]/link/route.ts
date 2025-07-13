import { prisma } from "@/lib/prisma";
import { InvitationSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = InvitationSchema.updateLinkInvitationSchema.safeParse(body);

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

    const { url } = parsed.data;

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId) return forbiddenError();

    const existingSlug = await prisma.invitation.findFirst({
      where: {
        OR: [{ slug: url }, { id: url }],
        NOT: {
          id: params.id,
        },
      },
    });

    if (existingSlug) {
      return ResponseJson(
        {
          message: "Link undangan sudah digunakan. Silakan masukan link lain.",
        },
        { status: 409 }
      );
    }

    const existingInvitationChange = await prisma.invitationChange.findFirst({
      where: {
        invitationId: params.id,
        type: "link",
      },
    });

    if (existingInvitationChange)
      return ResponseJson(
        {
          message:
            "Link undangan hanya bisa diubah satu kali dan tidak dapat diubah kembali.",
        },
        { status: 409 }
      );

    const invitation = await prisma.invitation.update({
      where: {
        id: params.id,
      },
      data: {
        slug: url,
      },
    });

    await prisma.invitationChange.create({
      data: {
        invitationId: params.id,
        type: "link",
      },
    });

    return ResponseJson(
      {
        message: "Link undangan berhasil diperbarui",
        data: invitation,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui link undangan");
  }
}
