import { prisma } from "@/lib/prisma";
import { BankAccountSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = BankAccountSchema.addressSchema.safeParse(body);

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

    if (!params.addressId) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            addressId: ["Address ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    const { address } = parsed.data;

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        transaction: {
          include: {
            status: true,
          },
        },
      },
    });

    if (!invitationByUserId) return forbiddenError();
    const transactionStatus = invitationByUserId.transaction?.status?.name;
    if (transactionStatus !== "SUCCESS") {
      return unpaidInvitationError();
    }

    const bankAccount = await prisma.bankAccount.update({
      where: {
        id: params.addressId,
      },
      data: {
        name: address,
      },
      include: {
        bank: true,
      },
    });

    return ResponseJson(
      {
        message: "Alamat berhasil diperbarui",
        data: bankAccount,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal memperbarui alamat");
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        transaction: {
          include: {
            status: true,
          },
        },
      },
    });

    if (!invitationByUserId) return forbiddenError();
    const transactionStatus = invitationByUserId.transaction?.status?.name;
    if (transactionStatus !== "SUCCESS") {
      return unpaidInvitationError();
    }

    const gift = await prisma.bankAccount.delete({
      where: {
        id: params.addressId,
      },
    });

    return ResponseJson(
      {
        message: "Alamat berhasil dihapus",
        data: gift,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal menghapus alamat");
  }
}
