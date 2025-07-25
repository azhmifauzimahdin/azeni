import { prisma } from "@/lib/prisma";
import { ReferralSchema } from "@/lib/schemas";
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
  { params }: { params: { referralId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const userName =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      user.username ||
      user.emailAddresses?.[0]?.emailAddress ||
      "Tidak diketahui";

    const body = await req.json();
    const parsed = ReferralSchema.referralCodeSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { code, description, discount, isPercent, maxDiscount, isActive } =
      parsed.data;

    const existingReferral = await prisma.referralCode.findUnique({
      where: { id: params.referralId },
    });

    if (!existingReferral) {
      return ResponseJson(
        { message: "Kode referral tidak ditemukan" },
        { status: 404 }
      );
    }

    const existing = await prisma.referralCode.findFirst({
      where: { code, NOT: { id: params.referralId } },
    });

    if (existing) {
      return ResponseJson(
        { message: "Kode referral sudah digunakan" },
        { status: 409 }
      );
    }

    await prisma.referralCode.update({
      where: {
        id: params.referralId,
      },
      data: {
        code,
        description,
        discount,
        isPercent,
        maxDiscount,
        isActive,
      },
    });

    const isDiscountChanged = discount !== Number(existingReferral.discount);
    const isIsPercentChanged = isPercent !== existingReferral.isPercent;
    const isMaxDiscountChanged =
      (maxDiscount ?? null) !==
      (existingReferral.maxDiscount !== null
        ? Number(existingReferral.maxDiscount)
        : null);

    if (isDiscountChanged || isIsPercentChanged || isMaxDiscountChanged) {
      await prisma.referralCodeLog.create({
        data: {
          userId,
          userName,
          referralCodeId: params.referralId,
          oldDiscount: isDiscountChanged ? existingReferral.discount : null,
          newDiscount: isDiscountChanged ? discount : null,
          oldIsPercent: isIsPercentChanged ? existingReferral.isPercent : null,
          newIsPercent: isIsPercentChanged ? isPercent : null,
          oldMaxDiscount: isMaxDiscountChanged
            ? existingReferral.maxDiscount
            : null,
          newMaxDiscount: isMaxDiscountChanged ? maxDiscount : null,
        },
      });
    }

    const updatedReferralCode = await prisma.referralCode.findUnique({
      where: { id: params.referralId },
      include: {
        referralCodeLogs: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return ResponseJson(
      {
        message: "Data kode referral berhasil diperbarui",
        data: updatedReferralCode,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui kode referral");
  }
}
export async function DELETE(
  _: Request,
  { params }: { params: { referralId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const referralCode = await prisma.referralCode.findUnique({
      where: { id: params.referralId },
    });

    if (!referralCode) {
      return ResponseJson(
        { message: "Kode referral tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.referralCode.delete({
      where: { id: params.referralId },
    });

    return ResponseJson(
      { message: "Data kode referral berhasil dihapus", data: referralCode },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus kode referral");
  }
}
