import { prisma } from "@/lib/prisma";
import { QuoteSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function PUT(
  req: Request,
  { params }: { params: { quoteId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const body = await req.json();
    const parsed = QuoteSchema.createQuoteSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { name, author } = parsed.data;

    const existingQuote = await prisma.quoteTemplate.findUnique({
      where: { id: params.quoteId },
    });

    if (!existingQuote) {
      return ResponseJson(
        { message: "Template quote tidak ditemukan" },
        { status: 404 }
      );
    }

    const quoteTemplate = await prisma.quoteTemplate.update({
      where: {
        id: params.quoteId,
      },
      data: {
        name,
        author,
      },
    });

    return ResponseJson(
      {
        message: "Data template quote berhasil diperbarui",
        data: quoteTemplate,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui template quote");
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { quoteId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const quoteTemplate = await prisma.quoteTemplate.findUnique({
      where: { id: params.quoteId },
    });

    if (!quoteTemplate) {
      return ResponseJson(
        { message: "Template quote tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.quoteTemplate.delete({
      where: { id: params.quoteId },
    });

    return ResponseJson(
      { message: "Data template quote berhasil dihapus", data: quoteTemplate },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus template quote");
  }
}
