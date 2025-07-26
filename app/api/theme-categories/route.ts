import { prisma } from "@/lib/prisma";
import { ThemeCategorySchema } from "@/lib/schemas";
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

    const themeCategory = await prisma.themeCategory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return ResponseJson(
      {
        message: "Data kategori tema berhasil diambil",
        data: themeCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil data tema kategori");
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
    const parsed = ThemeCategorySchema.themeCategorySchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { name } = parsed.data;

    const existing = await prisma.themeCategory.findFirst({
      where: { name },
    });

    if (existing) {
      return ResponseJson(
        { message: "Nama kategori sudah digunakan" },
        { status: 409 }
      );
    }

    const themeCategory = await prisma.themeCategory.create({
      data: {
        name,
      },
    });

    return ResponseJson(
      {
        message: "Data kategori tema berhasil dibuat",
        data: themeCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat data kategori tema");
  }
}
