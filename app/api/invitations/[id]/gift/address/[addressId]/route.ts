import { prisma } from "@/lib/prisma";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { addressSchema } from "../route";

export async function PUT(
  req: Request,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = addressSchema.safeParse(body);

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
    });

    if (!invitationByUserId) return forbiddenError();

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

    const InvitaionByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!InvitaionByUserId) return forbiddenError();

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
