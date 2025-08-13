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

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const status = await prisma.paymentStatus.findFirst({
      where: { name: "SUCCESS" },
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

    const referralCodes = await prisma.referralCode.findMany({
      orderBy: {
        createdAt: "desc",
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

    const referralCodesWithBalance = referralCodes.map((ref) => {
      const totalReward = ref.transactions.reduce((acc, trx) => {
        if (trx.status?.id === status.id) {
          return acc + (trx.referralDiscountAmount?.toNumber() ?? 0);
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

    return ResponseJson(
      {
        message: "Data kode referral berhasil diambil",
        data: referralCodesWithBalance,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil data kode referral");
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
    const parsed = ReferralSchema.referralCodeSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const {
      userName,
      code,
      description,
      discount,
      isPercent,
      maxDiscount,
      isActive,
    } = parsed.data;

    const existing = await prisma.referralCode.findFirst({
      where: { code },
    });

    if (existing) {
      return ResponseJson(
        { message: "Kode referral sudah digunakan" },
        { status: 409 }
      );
    }

    const referralCode = await prisma.referralCode.create({
      data: {
        userId: code,
        userName,
        code,
        description,
        discount,
        isPercent,
        maxDiscount,
        isActive,
      },
      include: {
        referralCodeLogs: {
          orderBy: {
            createdAt: "desc",
          },
        },
        transactions: {
          include: {
            status: true,
            referralCode: true,
          },
          orderBy: {
            createdAt: "desc",
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
      },
    });

    return ResponseJson(
      {
        message: "Data kode referral berhasil dibuat",
        data: referralCode,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat data kode referral");
  }
}
