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

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const music = await prisma.quoteTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return ResponseJson(
      {
        message: "Data template quote berhasil diambil",
        data: music,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil template quote");
  }
}

export async function POST(req: Request) {
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

    const quoteTemplate = await prisma.quoteTemplate.create({
      data: {
        name,
        author,
      },
    });

    return ResponseJson(
      {
        message: "Data template quote berhasil dibuat",
        data: quoteTemplate,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat data template quote");
  }
}
