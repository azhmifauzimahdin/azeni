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

export async function PUT(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
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

    const existingThemeCategory = await prisma.themeCategory.findUnique({
      where: { id: params.categoryId },
    });

    if (!existingThemeCategory) {
      return ResponseJson(
        { message: "Kategori tema tidak ditemukan" },
        { status: 404 }
      );
    }

    const existing = await prisma.themeCategory.findFirst({
      where: { name, NOT: { id: params.categoryId } },
    });

    if (existing) {
      return ResponseJson(
        { message: "Nama kategori sudah digunakan" },
        { status: 409 }
      );
    }

    const themeCategory = await prisma.themeCategory.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
      },
    });

    return ResponseJson(
      {
        message: "Data kategori tema berhasil diperbarui",
        data: themeCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui kategori tema");
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const themeCategory = await prisma.themeCategory.findUnique({
      where: { id: params.categoryId },
    });

    if (!themeCategory) {
      return ResponseJson(
        { message: "Kategori tema tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.themeCategory.delete({
      where: { id: params.categoryId },
    });

    return ResponseJson(
      { message: "Data kategori tema berhasil dihapus", data: themeCategory },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus kategori tema");
  }
}
