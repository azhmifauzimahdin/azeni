import snap from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";
import {
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function PATCH(
  _: Request,
  { params }: { params: { id: string } }
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

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        transaction: {
          where: { isActive: true },
          include: {
            status: true,
          },
        },
      },
    });

    if (!invitationByUserId || !invitationByUserId.transaction)
      return forbiddenError();

    const pendingStatus = await prisma.paymentStatus.findUnique({
      where: { name: "PENDING" },
    });

    if (!pendingStatus) {
      throw new Error("Status pembayaran tidak ditemukan di database");
    }

    const user = await currentUser();
    const orderId = generateOrderId();

    const midtransRes = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(invitationByUserId.transaction.amount),
      },
      item_details: [
        {
          id: randomUUID(),
          price: Number(invitationByUserId.transaction.amount),
          quantity: 1,
          name: "Undangan Pernikahan",
          brand: "Undangan Digital",
          merchant_name: "Azeni",
        },
      ],
      customer_details: {
        first_name: user?.firstName ?? "Tamu",
        last_name: user?.lastName ?? undefined,
      },
      callbacks: {
        finish: "",
      },
    });

    const transaction = await prisma.transaction.update({
      where: { id: invitationByUserId.transaction.id },
      data: {
        orderId: orderId,
        statusId: pendingStatus.id,
        redirectUrl: midtransRes.redirect_url,
        snapToken: midtransRes.token,
      },
    });

    return ResponseJson(
      {
        message: "Transaksi berhasil dibatalkan",
        data: transaction,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal membatalkan transaksi");
  }
}
