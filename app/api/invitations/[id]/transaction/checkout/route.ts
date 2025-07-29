import { generateOrderId } from "@/lib/generateOrderId";
import snap from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";
import { defaultWhatsappMessageTemplate } from "@/lib/utils/default";
import { generateUniqueGuestCode } from "@/lib/utils/generate-unique-guest-code";
import {
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const userClient = await client.users.getUser(userId);
    const role = userClient.publicMetadata.role;

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
        ...(role !== "admin" && { userId }),
      },
      include: {
        theme: true,
        transaction: {
          include: {
            status: true,
          },
        },
      },
    });

    if (!invitationByUserId) return forbiddenError();

    if (!invitationByUserId.transaction) {
      return ResponseJson(
        { message: "Transaksi tidak ditemukan untuk undangan ini" },
        { status: 400 }
      );
    }

    if (invitationByUserId.transaction.status.name !== "CREATED") {
      return ResponseJson(
        {
          message:
            "Transaksi sudah dibuat atau sedang diproses. Silakan lanjutkan pembayaran.",
          data: {
            snapToken: invitationByUserId.transaction.snapToken,
            redirectUrl: invitationByUserId.transaction.redirectUrl,
          },
        },
        { status: 400 }
      );
    }

    const amount = invitationByUserId.transaction.amount;

    if (!amount || amount.lte(0)) {
      return ResponseJson(
        {
          message: "Jumlah pembayaran tidak valid",
        },
        { status: 400 }
      );
    }

    const status = await prisma.paymentStatus.findFirst({
      where: {
        name: "PENDING",
      },
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

    const user = await currentUser();
    const orderId = generateOrderId();

    const midtransRes = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(amount),
      },
      item_details: [
        {
          id: randomUUID(),
          price: Number(amount),
          quantity: 1,
          name: "Undangan Pernikahan",
          brand: "Undangan Digital",
          merchant_name: "Azeni",
        },
      ],
      customer_details: {
        first_name: user?.firstName ?? "Tamu",
        last_name: user?.lastName ?? undefined,
        email: user?.emailAddresses[0].emailAddress,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/invitation/new/${invitationByUserId.id}/payment`,
      },
    });

    const transaction = await prisma.transaction.update({
      where: {
        id: invitationByUserId.transaction.id,
      },
      data: {
        orderId,
        date: new Date(),
        statusId: status.id,
        redirectUrl: midtransRes.redirect_url,
        snapToken: midtransRes.token,
      },
      include: {
        status: true,
        webhookLogs: {
          orderBy: {
            eventAt: "desc",
          },
        },
        referralCode: true,
      },
    });

    const setting = await prisma.setting.create({
      data: {
        invitationId: invitationByUserId.id,
        whatsappMessageTemplate: defaultWhatsappMessageTemplate,
      },
    });

    const kode = await generateUniqueGuestCode();

    const guest = await prisma.guest.create({
      data: {
        code: kode,
        invitationId: invitationByUserId.id,
        name: "tamu",
        isAttending: false,
        color: "bg-teal-500",
      },
    });

    return ResponseJson(
      {
        message: "Transaksi berhasil dibuat",
        data: { transaction: transaction, guest: guest, setting: setting },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat transaksi");
  }
}
