"use client";

import { StatusBadge } from "@/app/(user)/dashboard/invitation/components/invitation-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link";

const InvitationPaymentCardSkeleton: React.FC = () => {
  return (
    <Card className="w-full max-w-xl mx-auto border shadow-xl overflow-hidden animate-pulse">
      <div className="px-6 py-4 bg-gray-300">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-6 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-20 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="bg-white px-6 py-5 space-y-4">
        <div className="text-center space-y-2">
          <div className="h-6 w-40 bg-gray-200 rounded mx-auto" />
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
        </div>

        <div className="text-center border-t pt-4 space-y-2">
          <div className="h-4 w-28 bg-gray-200 rounded mx-auto" />
          <div className="h-7 w-32 bg-gray-200 rounded mx-auto" />
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 space-y-3">
          <div className="h-4 w-3/4 bg-gray-200 rounded mx-auto" />
          <div className="h-10 w-full bg-gray-200 rounded-lg" />
          <div className="h-10 w-full bg-gray-200 rounded-lg" />
        </div>
      </div>
    </Card>
  );
};

type InvitationPaymentCardProps = {
  invitationId: string;
  groomName: string;
  brideName: string;
  amount: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED";
  pending?: boolean;
  onPay: () => void;
  onRetryPayment?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isRetrying?: boolean;
  isCancelling?: boolean;
  isFetching?: boolean;
};

const statusColorMap: Record<InvitationPaymentCardProps["status"], string> = {
  SUCCESS: "bg-green-600",
  PENDING: "bg-yellow-500",
  FAILED: "bg-red-600",
  CANCELLED: "bg-red-500",
  REFUNDED: "bg-gray-500",
};

const InvitationPaymentCard: React.FC<InvitationPaymentCardProps> = ({
  invitationId,
  groomName,
  brideName,
  amount,
  status,
  pending,
  onPay,
  onRetryPayment,
  onCancel,
  isLoading,
  isRetrying,
  isCancelling,
  isFetching,
}) => {
  if (isFetching) return <InvitationPaymentCardSkeleton />;

  return (
    <Card className="w-full max-w-xl mx-auto border shadow-xl overflow-hidden">
      <CardHeader
        className={clsx("text-white", statusColorMap[status], "p-6 pb-4")}
      >
        <CardDescription className="text-white uppercase tracking-wide text-sm font-medium">
          Status Transaksi
        </CardDescription>
        <div className="flex items-center justify-between mt-2">
          <CardTitle className="text-white text-lg font-bold">
            {status}
          </CardTitle>
          <StatusBadge statusName={status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {groomName} & {brideName}
          </h2>
          <p className="text-sm text-gray-500">Undangan Pernikahan Digital</p>
        </div>

        <div className="text-center border-t pt-4">
          <p className="text-sm text-gray-500">Jumlah Pembayaran</p>
          <p className="text-2xl font-bold text-gray-800">
            Rp {Number(amount).toLocaleString("id-ID")}
          </p>
        </div>

        {status === "PENDING" && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-4 py-3 text-sm text-center space-y-3">
            <p>
              Transaksi masih menunggu pembayaran. Silakan selesaikan dengan
              menekan tombol di bawah.
            </p>

            <Button
              variant="primary"
              onClick={onPay}
              disabled={isLoading || isCancelling || isFetching || isRetrying}
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Lanjutkan Pembayaran
            </Button>

            {pending && (
              <Button
                variant="outline"
                onClick={onRetryPayment}
                disabled={isLoading || isFetching}
                isLoading={isRetrying}
                className="w-full"
              >
                {isRetrying && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Ganti Metode Pembayaran
              </Button>
            )}

            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                isLoading={isCancelling}
                disabled={isCancelling || isLoading || isFetching || isRetrying}
                className="w-full border-red-300 text-red-600 hover:bg-red-100"
              >
                {isCancelling && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Batalkan Pesanan
              </Button>
            )}
          </div>
        )}

        {status === "FAILED" && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm text-center space-y-2">
            <p>
              Transaksi kamu sudah kedaluwarsa. Jangan khawatir, kamu bisa mulai
              ulang dan buat undangan baru sekarang.
            </p>
          </div>
        )}

        {status === "REFUNDED" && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm text-center space-y-2">
            <p>Pembayaran gagal atau dibatalkan. Silakan coba lagi.</p>
          </div>
        )}

        {status === "CANCELLED" && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm text-center space-y-2">
            <p>
              Pembayaran telah dibatalkan. Kamu bisa membuat undangan baru kapan
              saja.
            </p>
          </div>
        )}

        {status === "SUCCESS" && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm text-center space-y-3">
            <p>
              Pembayaran kamu berhasil. Terima kasih atas kepercayaannya!
              Undanganmu sudah aktif dan siap untuk diedit.
            </p>

            <LinkButton
              variant="outline"
              className="w-full"
              href={`/dashboard/invitation/${invitationId}`}
              disabled={isFetching}
            >
              Edit Undangan
            </LinkButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitationPaymentCard;
