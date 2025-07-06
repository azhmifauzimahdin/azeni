import { prisma } from "@/lib/prisma";
import { BankAccountSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string; giftId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = BankAccountSchema.updateBankAccountSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    if (!params.id) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            id: ["ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    if (!params.giftId) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            giftId: ["Gift ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    const { bankId, accountNumber, name } = parsed.data;

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId) return forbiddenError();

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

    const bankAccount = await prisma.bankAccount.update({
      where: {
        id: params.giftId,
      },
      data: {
        bankId,
        accountNumber,
        name,
      },
      include: {
        bank: true,
      },
    });

    return ResponseJson(
      {
        message: "Rekening berhasil diperbarui",
        data: bankAccount,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui rekening");
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string; giftId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    if (!params.id) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            id: ["ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    if (!params.giftId) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            giftId: ["Gift ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    const InvitaionByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!InvitaionByUserId) return forbiddenError();

    const gift = await prisma.bankAccount.delete({
      where: {
        id: params.giftId,
      },
    });

    return ResponseJson(
      {
        message: "Rekening berhasil dihapus",
        data: gift,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus rekening");
  }
}
