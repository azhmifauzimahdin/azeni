import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string; giftId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const body = await req.json();

    const { bankId, accountNumber, name } = body;

    const errors = [];
    if (!bankId)
      errors.push({ field: "bankId", message: "Bank ID harus diisi." });
    if (!accountNumber)
      errors.push({
        field: "accountNumber",
        message: "Nomor rekening harus diisi.",
      });
    if (!name) errors.push({ field: "name", message: "Nama harus diisi." });
    if (!params.id)
      errors.push({
        field: "invitationId",
        message: "Invitation ID harus diisi.",
      });

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId)
      return ResponseJson("Unauthorized", { status: 401 });

    const bank = await prisma.bank.findFirst({
      where: {
        id: bankId,
      },
    });

    if (!bank) {
      return ResponseJson(
        { message: "Bank ID tidak ditemukan." },
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

    return ResponseJson(bankAccount, { status: 201 });
  } catch (error) {
    console.error("Error updating bank account:", error);
    return ResponseJson(
      { message: "Gagal ubah nomor rekening." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string; giftId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const InvitaionByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!InvitaionByUserId)
      return ResponseJson("Unauthorized", { status: 401 });

    const gift = await prisma.bankAccount.delete({
      where: {
        id: params.giftId,
      },
    });

    return ResponseJson(gift, { status: 200 });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    return ResponseJson(
      { message: "Gagal hapus nomor rekening." },
      { status: 500 }
    );
  }
}
