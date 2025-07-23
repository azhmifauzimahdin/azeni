import { prisma } from "@/lib/prisma";
import { QuoteSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = QuoteSchema.createQuoteSchema.safeParse(body);

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

    const { name, author } = parsed.data;

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        transaction: {
          include: {
            status: true,
          },
        },
      },
    });

    if (!invitationByUserId) return forbiddenError();
    const transactionStatus = invitationByUserId.transaction?.status?.name;
    if (transactionStatus !== "SUCCESS") {
      return unpaidInvitationError();
    }

    const existing = await prisma.quote.findFirst({
      where: {
        invitationId: params.id,
      },
    });

    const quote = await prisma.quote.upsert({
      where: {
        invitationId: params.id,
      },
      update: {
        name,
        author,
      },
      create: { name, author, invitationId: params.id },
    });

    const isCreate = !existing;

    return ResponseJson(
      {
        message: isCreate
          ? "Data kutipan berhasil dibuat"
          : "Data kutipan berhasil diperbarui",
        data: quote,
      },
      { status: isCreate ? 201 : 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat atau memperbarui kutipan");
  }
}
