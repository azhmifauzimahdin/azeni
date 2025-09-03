import { prisma } from "@/lib/prisma";
import { generateUniqueReferralCode } from "@/lib/utils/generate-unique-referral-code";
import {
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isBefore } from "date-fns";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const referralCode = await prisma.referralCode.findFirst({
      where: {
        userId: userId,
      },
      include: {
        transactions: {
          where: {
            status: {
              name: "SUCCESS",
            },
          },
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
        message: "Kode referral berhasil diambil",
        data: referralCode,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil kode referral");
  }
}

export async function POST(_: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const userName =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      user.username ||
      user.emailAddresses?.[0]?.emailAddress ||
      "Tidak diketahui";

    const existing = await prisma.referralCode.findFirst({
      where: { userId },
    });

    if (existing) {
      return ResponseJson(
        { message: "Kamu sudah memiliki kode referral." },
        { status: 409 }
      );
    }

    const config = await prisma.referralConfig.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    const now = new Date();
    if (isBefore(config?.endDate || now, now)) {
      return ResponseJson(
        {
          message:
            "Tidak dapat membuat kode referral karena periode telah berakhir.",
        },
        { status: 403 }
      );
    }

    const uniqueCode = await generateUniqueReferralCode();

    const referralCode = await prisma.referralCode.create({
      data: {
        userId,
        userName,
        code: uniqueCode,
        referrerReward: config?.referrerReward ?? 10000,
        referrerIsPercent: config?.referrerIsPercent ?? false,
        description: config?.description ?? "Diskon langsung Rp10.000",
        discount: config?.discount ?? 10000,
        isPercent: config?.isPercent ?? false,
        maxDiscount: config?.maxDiscount ?? 0,
      },
      include: {
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
