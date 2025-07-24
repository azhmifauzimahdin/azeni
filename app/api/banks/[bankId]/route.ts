import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { BankSchema } from "@/lib/schemas";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
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
  { params }: { params: { bankId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const body = await req.json();
    const parsed = BankSchema.bankSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { name, icon } = parsed.data;

    const existingBank = await prisma.bank.findUnique({
      where: { id: params.bankId },
    });

    if (!existingBank) {
      return ResponseJson({ message: "Bank tidak ditemukan" }, { status: 404 });
    }

    const existing = await prisma.bank.findFirst({
      where: { name, NOT: { id: params.bankId } },
    });

    if (existing) {
      return ResponseJson(
        { message: "Nama bank sudah digunakan" },
        { status: 409 }
      );
    }

    const bank = await prisma.bank.update({
      where: {
        id: params.bankId,
      },
      data: {
        name,
        icon,
      },
    });

    return ResponseJson(
      {
        message: "Data bank berhasil diperbarui",
        data: bank,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui bank");
  }
}

async function deleteImageFromCloudinary(url: string) {
  const publicId = extractCloudinaryPublicId(url);
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Gagal menghapus gambar dari Cloudinary:", err);
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { bankId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const bank = await prisma.bank.findUnique({
      where: { id: params.bankId },
    });

    if (!bank) {
      return ResponseJson({ message: "Bank tidak ditemukan" }, { status: 404 });
    }

    if (bank.icon) {
      await deleteImageFromCloudinary(bank.icon);
    }

    await prisma.bank.delete({
      where: { id: params.bankId },
    });

    return ResponseJson(
      { message: "Data bank berhasil dihapus", data: bank },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus bank");
  }
}
