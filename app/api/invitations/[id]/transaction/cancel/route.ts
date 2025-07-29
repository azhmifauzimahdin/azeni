/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import {
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";
import axios, { AxiosError } from "axios";

export async function PATCH(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

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

    const status = invitationByUserId.transaction.status?.name;

    if (status !== "PENDING" && status !== "FAILED") {
      return ResponseJson(
        {
          message: "Transaksi tidak bisa dibatalkan",
        },
        { status: 400 }
      );
    }

    const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;
    if (!midtransServerKey) {
      throw new Error("MIDTRANS_SERVER_KEY belum diset di environment");
    }

    const authHeader = Buffer.from(midtransServerKey + ":").toString("base64");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_MIDTRANS_BASE_URL}/v2/${invitationByUserId.transaction.id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Basic ${authHeader}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err: unknown) {
      const error = err as AxiosError;

      const message =
        (error.response?.data as any)?.status_message ||
        (error.response?.data as any)?.message ||
        "Gagal cancel transaksi di Midtrans";

      throw new Error(`Gagal cancel transaksi di Midtrans: ${message}`);
    }

    const cancelledStatus = await prisma.paymentStatus.findUnique({
      where: { name: "CANCELLED" },
    });

    if (!cancelledStatus) {
      throw new Error("Status pembayaran tidak ditemukan di database");
    }

    const transaction = await prisma.transaction.update({
      where: { id: invitationByUserId.transaction.id },
      data: {
        statusId: cancelledStatus.id,
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
