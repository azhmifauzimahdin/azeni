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

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = BankAccountSchema.createBankAccountSchema.safeParse(body);

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

    const bankAccount = await prisma.bankAccount.create({
      data: {
        invitationId: params.id,
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
        message: "Nomor rekening berhasil dibuat",
        data: bankAccount,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat nomor rekening");
  }
}
