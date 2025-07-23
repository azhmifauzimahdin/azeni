import { prisma } from "@/lib/prisma";
import { ResponseJson, handleError } from "@/lib/utils/response";
import { NextRequest } from "next/server";
import crypto from "crypto";
import axios from "axios";

function mapMidtransToStatusName(
  transactionStatus: string,
  fraudStatus?: string
): "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED" | "CANCELLED" | "EXPIRED" {
  switch (transactionStatus) {
    case "capture":
      return fraudStatus === "accept" ? "SUCCESS" : "PENDING";

    case "settlement":
      return "SUCCESS";

    case "pending":
      return "PENDING";

    case "deny":
      return "FAILED";

    case "expire":
      return "EXPIRED";

    case "cancel":
      return "CANCELLED";

    case "refund":
    case "partial_refund":
      return "REFUNDED";

    default:
      return "PENDING";
  }
}

function generateSignatureKey(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string
): string {
  const raw = orderId + statusCode + grossAmount + serverKey;
  return crypto.createHash("sha512").update(raw).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      transaction_status,
      payment_type,
      fraud_status,
      signature_key,
      expiry_time,
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      throw new Error(
        "Kunci server Midtrans (MIDTRANS_SERVER_KEY) belum disetel"
      );
    }

    const expectedSignature = generateSignatureKey(
      order_id,
      status_code,
      gross_amount,
      serverKey
    );

    if (signature_key?.toLowerCase() !== expectedSignature.toLowerCase()) {
      return new Response("Signature tidak valid", { status: 403 });
    }

    if (!/^[\w-]+$/.test(order_id)) {
      return new Response("Format order_id tidak valid", { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { orderId: order_id },
    });

    if (!transaction) {
      return new Response("Transaksi tidak ditemukan", { status: 404 });
    }

    const dbAmount = Number(transaction.amount);
    const receivedAmount = parseFloat(gross_amount);

    if (dbAmount !== receivedAmount) {
      return new Response("Jumlah pembayaran tidak sesuai", { status: 403 });
    }

    const statusName = mapMidtransToStatusName(
      transaction_status,
      fraud_status
    );

    const currentStatus = await prisma.paymentStatus.findUnique({
      where: { id: transaction.statusId },
      select: { name: true },
    });

    if (
      currentStatus?.name === "CANCELLED" &&
      ["FAILED"].includes(statusName)
    ) {
      return ResponseJson(
        {
          message: "Transaksi sudah dibatalkan sebelumnya, status tidak diubah",
        },
        { status: 200 }
      );
    }

    const status = await prisma.paymentStatus.findUnique({
      where: { name: statusName },
      select: { id: true },
    });

    if (!status) {
      throw new Error(
        `Status pembayaran "${statusName}" tidak ditemukan di database`
      );
    }

    const bank = body.va_numbers?.[0]?.bank || body.bank || null;
    const vaNumber = body.va_numbers?.[0]?.va_number || null;
    const store = body.store || null;
    const paymentCode = body.payment_code || null;
    const expiredAt = expiry_time ? new Date(expiry_time) : null;

    let pdfUrl: string | null = null;

    if (["settlement", "capture"].includes(transaction_status)) {
      try {
        const invoiceRes = await axios.get(
          `${process.env.NEXT_PUBLIC_MIDTRANS_BASE_URL}/v2/invoices/${order_id}`,
          {
            headers: {
              Authorization:
                "Basic " + Buffer.from(`${serverKey}:`).toString("base64"),
              "Content-Type": "application/json",
            },
          }
        );

        console.log(invoiceRes);
        pdfUrl = invoiceRes.data?.pdf_url || null;
      } catch (err) {
        console.error("Gagal mengambil pdf_url dari Midtrans:", err);
      }
    }

    await prisma.$transaction([
      prisma.midtransWebhookLog.create({
        data: {
          orderId: order_id,
          transactionStatus: transaction_status,
          paymentType: payment_type,
          fraudStatus: fraud_status,
          bank,
          vaNumber,
          store,
          paymentCode,
          expiredAt,
          rawBody: body,
          eventAt: new Date(),
        },
      }),
      prisma.transaction.update({
        where: { orderId: order_id },
        data: {
          statusId: status.id,
          midtransPdfUrl: pdfUrl,
        },
      }),
    ]);

    return ResponseJson(
      { message: "Webhook berhasil diproses" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Webhook gagal diproses");
  }
}
