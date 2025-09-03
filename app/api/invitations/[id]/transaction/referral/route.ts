import { prisma } from "@/lib/prisma";
import { TransactionSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Decimal } from "@prisma/client/runtime/library";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    const body = await req.json();
    const parsed = TransactionSchema.applyReferralSchema.safeParse(body);
    if (!parsed.success) return handleZodError(parsed.error);

    if (!params.id) {
      return ResponseJson(
        { message: "Validasi gagal", errors: { id: ["ID wajib diisi"] } },
        { status: 400 }
      );
    }

    const { referralCode } = parsed.data;

    const invitation = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        ...(role !== "admin" && { userId }),
      },
      include: {
        theme: true,
        transaction: {
          include: {
            status: true,
            referralCode: true,
          },
        },
      },
    });

    if (!invitation || !invitation.transaction || !invitation.theme)
      return forbiddenError();

    const transaction = invitation.transaction;

    if (transaction.status.name !== "CREATED") {
      return ResponseJson(
        {
          message:
            "Referral hanya dapat diubah saat transaksi masih dalam status CREATED.",
        },
        { status: 400 }
      );
    }

    const currentAmount = transaction.amount ?? new Decimal(0);
    const currentDiscount =
      transaction.referralDiscountAmount ?? new Decimal(0);

    const baseAmount = currentAmount.plus(currentDiscount);

    if (!referralCode) {
      const updated = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          amount: baseAmount,
          referralCodeId: null,
          referralDiscountAmount: new Decimal(0),
          referrerRewardAmount: new Decimal(0),
        },
        include: { status: true, referralCode: true },
      });

      return ResponseJson(
        { message: "Kode referral berhasil dihapus", data: updated },
        { status: 200 }
      );
    }

    const referral = await prisma.referralCode.findFirst({
      where: {
        code: referralCode,
        isActive: true,
      },
    });

    if (!referral) {
      return ResponseJson(
        { message: "Kode referral tidak ditemukan atau tidak aktif." },
        { status: 400 }
      );
    }

    if (referral.userId === userId) {
      return ResponseJson(
        { message: "Anda tidak bisa menggunakan kode referral milik sendiri." },
        { status: 400 }
      );
    }

    if (transaction.referralCode?.code === referralCode) {
      return ResponseJson(
        { message: "Kode referral sudah diterapkan sebelumnya." },
        { status: 400 }
      );
    }

    if (transaction.referralCodeId !== referral.id) {
      const alreadyUsed = await prisma.transaction.findFirst({
        where: {
          invitation: {
            userId,
          },
          referralCodeId: referral.id,
          id: { not: transaction.id },
          status: {
            name: {
              not: "CANCELLED",
            },
          },
        },
      });

      if (alreadyUsed) {
        return ResponseJson(
          { message: "Kode referral sudah pernah digunakan oleh Anda." },
          { status: 400 }
        );
      }
    }

    let discount = referral.isPercent
      ? baseAmount.mul(referral.discount ?? 0).div(100)
      : referral.discount ?? new Decimal(0);

    if (referral.isPercent && referral.maxDiscount) {
      discount = Decimal.min(discount, referral.maxDiscount);
    }

    const finalAmount = Decimal.max(0, baseAmount.sub(discount));
    const referrerReward = referral.referrerIsPercent
      ? baseAmount.mul(referral.referrerReward ?? 0).div(100)
      : referral.referrerReward ?? new Decimal(0);

    const updated = await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        amount: finalAmount,
        referralCodeId: referral.id,
        referralDiscountAmount: discount,
        referrerRewardAmount: referrerReward,
      },
      include: {
        status: true,
        webhookLogs: {
          orderBy: {
            eventAt: "desc",
          },
        },
        referralCode: true,
      },
    });

    return ResponseJson(
      { message: "Kode referral berhasil diterapkan", data: updated },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memproses referral");
  }
}
