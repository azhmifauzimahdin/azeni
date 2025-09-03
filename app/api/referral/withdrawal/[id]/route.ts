import { prisma } from "@/lib/prisma";
import { ReferralSchema } from "@/lib/schemas";
import {
  ResponseJson,
  forbiddenError,
  handleError,
  handleZodError,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";

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

    if (role !== "admin") return forbiddenError();

    const body = await req.json();
    const parsed = ReferralSchema.updateWithdrawalStatusSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }
    const { status, transferProofUrl, note } = body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return ResponseJson({ message: "Status tidak valid" }, { status: 400 });
    }

    const withdrawal = await prisma.referralWithdrawal.update({
      where: { id: params.id },
      data: {
        status,
        transferProofUrl: status === "APPROVED" ? transferProofUrl : undefined,
        note: status === "REJECTED" ? note : undefined,
        processedAt: new Date(),
      },
      include: { bank: true, referralCode: true },
    });

    const referralCodes = await prisma.referralCode.findMany({
      where: {
        id: withdrawal.referralCodeId,
      },
      include: {
        transactions: {
          include: {
            status: true,
          },
        },
        withdrawals: {
          include: {
            bank: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        referralCodeLogs: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const statusSuccess = await prisma.paymentStatus.findFirst({
      where: { name: "SUCCESS" },
    });

    if (!statusSuccess) {
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

    const referralCodesWithBalance = referralCodes.map((ref) => {
      const totalReward = ref.transactions.reduce((acc, trx) => {
        if (trx.status?.id === statusSuccess.id) {
          return acc + (trx.referrerRewardAmount?.toNumber() ?? 0);
        }
        return acc;
      }, 0);

      const totalWithdrawn = ref.withdrawals
        .filter((wd) => wd.status === "APPROVED")
        .reduce((acc, wd) => acc + wd.amount.toNumber(), 0);

      const availableBalance = totalReward - totalWithdrawn;

      return {
        ...ref,
        balance: {
          totalReward,
          totalWithdrawn,
          availableBalance,
        },
      };
    });

    return ResponseJson({
      message: `Penarikan berhasil di${
        status === "APPROVED" ? "setujui" : "tolak"
      }`,
      data: { withdrawal, referralCode: referralCodesWithBalance[0] },
    });
  } catch (error) {
    return handleError(error, "Gagal memproses penarikan");
  }
}
