import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const body = await req.json();

    const { address } = body;

    const errors = [];
    if (!address)
      errors.push({ field: "address", message: "Alamat harus diisi." });
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

    return ResponseJson(bankAccount, { status: 201 });
  } catch (error) {
    console.error("Error updating  address:", error);
    return ResponseJson({ message: "Gagal ubah alamat." }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string; addressId: string } }
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
        id: params.addressId,
      },
    });

    return ResponseJson(gift, { status: 200 });
  } catch (error) {
    console.error("Error deleting address:", error);
    return ResponseJson({ message: "Gagal hapus alamat." }, { status: 500 });
  }
}
