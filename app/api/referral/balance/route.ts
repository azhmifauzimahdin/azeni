import { prisma } from "@/lib/prisma";
import { ResponseJson, unauthorizedError } from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return unauthorizedError();

  const status = await prisma.paymentStatus.findFirst({
    where: {
      name: "SUCCESS",
    },
  });

  if (!status) {
    return ResponseJson(
      {
        message: "Status pembayaran tidak ditemukan",
        errors: {
          statusId: [
            "Status pembayaran dengan ID atau nama tersebut tidak tersedia",
          ],
        },
      },
      { status: 404 }
    );
  }

  const referral = await prisma.referralCode.findFirst({
    where: { userId },
    include: {
      transactions: {
        where: {
          statusId: status.id,
        },
        select: {
          referrerRewardAmount: true,
        },
      },
      withdrawals: {
        where: {
          status: "APPROVED",
        },
        select: {
          amount: true,
        },
      },
    },
  });

  if (!referral) {
    return ResponseJson(
      { message: "Kode referral tidak ditemukan" },
      { status: 404 }
    );
  }

  const totalReward = referral.transactions.reduce((acc, trx) => {
    return acc + (trx.referrerRewardAmount?.toNumber() ?? 0);
  }, 0);

  const totalWithdrawn = referral.withdrawals.reduce((acc, wd) => {
    return acc + wd.amount.toNumber();
  }, 0);

  const availableBalance = totalReward - totalWithdrawn;

  return ResponseJson({
    message: "Berhasil mengambil data",
    data: {
      totalReward,
      totalWithdrawn,
      availableBalance,
    },
  });
}
