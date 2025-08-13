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
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(
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
    const parsed = ReferralSchema.referralWithdrawalSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { amount, bankId, accountNumber, name, note } = parsed.data;

    const bank = await prisma.bank.findFirst({
      where: {
        id: bankId,
      },
    });

    if (!bank) {
      return ResponseJson(
        {
          message: "Bank tidak ditemukan",
          errors: {
            bank: ["Bank dengan ID atau nama tersebut tidak tersedia"],
          },
        },
        { status: 404 }
      );
    }

    const referral = await prisma.referralCode.findUnique({
      where: { id: params.id },
      include: {
        withdrawals: { where: { status: "PENDING" } },
      },
    });

    if (!referral) {
      return ResponseJson(
        { message: "Kode referral tidak ditemukan" },
        { status: 404 }
      );
    }

    if (referral.withdrawals.length > 0) {
      return ResponseJson(
        { message: "Masih ada penarikan yang sedang diproses" },
        { status: 409 }
      );
    }

    const totalIncome = await prisma.transaction.aggregate({
      where: { referralCodeId: referral.id },
      _sum: { amount: true },
    });

    const totalWithdrawn = await prisma.referralWithdrawal.aggregate({
      where: {
        referralCodeId: referral.id,
        status: { in: ["PENDING", "APPROVED"] },
      },
      _sum: { amount: true },
    });

    const balance = new Decimal(totalIncome._sum.amount || 0).minus(
      totalWithdrawn._sum.amount || 0
    );

    if (balance.lessThan(amount)) {
      return ResponseJson(
        { message: "Saldo tidak mencukupi" },
        { status: 400 }
      );
    }

    const MIN_WITHDRAWAL_AMOUNT = 10000;

    if (amount < MIN_WITHDRAWAL_AMOUNT) {
      return ResponseJson(
        { message: "Minimal penarikan adalah Rp50.000" },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.referralWithdrawal.create({
      data: {
        referralCodeId: referral.id,
        amount,
        bankId,
        accountNumber,
        name,
        note,
      },
      include: {
        bank: true,
        referralCode: true,
      },
    });

    return ResponseJson(
      {
        message: "Permintaan penarikan berhasil dibuat",
        data: withdrawal,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat atau memperbarui pasangan");
  }
}
