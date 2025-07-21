"use client";

import React, { useEffect, useState } from "react";
import PaymentStatus from "./payment-status";
import toast from "react-hot-toast";
import useUserTransactions from "@/hooks/use-user-transaction";
import useUserInvitations from "@/hooks/use-user-invitation";
import useInvitationStore from "@/stores/invitation-store";
import useTransactionStore from "@/stores/transaction-store";
import { TransactionService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import CancelConfirmationModal from "@/components/ui/cancel-confirmation-modal";

const VALID_STATUSES = [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
] as const;
type TransactionStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(status: string | null): status is TransactionStatus {
  return VALID_STATUSES.includes(status as TransactionStatus);
}

const PaymentContent: React.FC = () => {
  const searchParams = useSearchParams();

  const params = {
    orderId: searchParams.get("order_id"),
    statusCode: searchParams.get("status_code"),
    transactionStatus: searchParams.get("transaction_status"),
  };

  const { isFetching, getTransactionByOrderId } = useUserTransactions();
  useUserInvitations();

  const transaction = getTransactionByOrderId(params.orderId || "");

  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [modalCancelOpen, setModalCancelOpen] = useState(false);

  const [status, setStatus] = useState<TransactionStatus>(() => {
    return isValidStatus(params.transactionStatus)
      ? params.transactionStatus
      : "PENDING";
  });

  const router = useRouter();
  useEffect(() => {
    if (params.transactionStatus?.toUpperCase() !== status) {
      router.push(
        `/invitation/payment?order_id=${params.orderId}&status_code=${
          params.statusCode
        }&transaction_status=${status.toLowerCase()}`
      );
    }
  }, [
    params.orderId,
    params.statusCode,
    params.transactionStatus,
    router,
    status,
  ]);

  useEffect(() => {
    if (transaction?.status?.name && isValidStatus(transaction.status.name)) {
      setStatus(transaction.status.name);
    }
  }, [transaction?.status?.name]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!params.orderId) return;
        const res = await TransactionService.fetchTransactionByOrderId(
          params.orderId
        );
        if (!res.data) router.push("/invitation/payment/not-found");
      } catch (error: unknown) {
        handleError(error, "invitation");
      }
    };

    fetchData();
  }, [params.orderId, router]);

  const updateTransactionStatusName = useInvitationStore(
    (state) => state.updateTransactionStatusName
  );
  const updateTransactionStatusNameTransaction = useTransactionStore(
    (state) => state.updateTransactionStatusName
  );
  const addWebhookLogToTransaction = useTransactionStore(
    (state) => state.addWebhookLogToTransaction
  );

  if (!params.orderId) {
    notFound();
    return null;
  }

  const onPay = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault?.();
    if (!transaction) return;

    setLoading(true);
    const res = await TransactionService.fetchTransactionByInvitationId(
      transaction.invitationId
    );

    const token = transaction.snapToken;
    if (typeof window !== "undefined" && window.snap) {
      window.snap.pay(token, {
        onSuccess: () => {
          updateTransactionStatusName(transaction.invitationId, "SUCCESS");
          updateTransactionStatusNameTransaction(transaction.id, "SUCCESS");

          router.push(
            `/invitation/payment?order_id=${transaction.orderId}&status_code=200&transaction_status=success`
          );
        },
        onPending: (result) => {
          const va = result.va_numbers?.[0];
          addWebhookLogToTransaction(transaction.id, {
            id: crypto.randomUUID(),
            orderId: result.order_id,
            transactionStatus: result.transaction_status,
            paymentType: result.payment_type,
            fraudStatus: result.fraud_status || null,
            bank: va?.bank || result.bank || null,
            vaNumber: va?.va_number || null,
            store: result.store || null,
            paymentCode: result.payment_code || null,
            expiredAt: result.expiry_time
              ? new Date(result.expiry_time).toISOString()
              : null,
            rawBody: result,
            eventAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        },
        onError: () => {
          updateTransactionStatusName(transaction.invitationId, "FAILED");
          updateTransactionStatusNameTransaction(transaction.id, "FAILED");

          router.push(
            `/invitation/payment?order_id=${transaction.orderId}&status_code=200&transaction_status=failed`
          );
        },
        onClose: () => {
          if (res.data.status.name === "FAILED") {
            updateTransactionStatusName(transaction.invitationId, "FAILED");
            updateTransactionStatusNameTransaction(transaction.id, "FAILED");

            router.push(
              `/invitation/payment?order_id=${transaction.orderId}&status_code=200&transaction_status=FAILED`
            );
          }
        },
      });

      setLoading(false);
    } else {
      toast.error("Pembayaran belum siap.");
      setLoading(false);
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const onCancel = async () => {
    try {
      if (!transaction?.invitationId) return;
      setCancelling(true);
      const res = await TransactionService.cancelTransaction(
        transaction?.invitationId
      );
      updateTransactionStatusName(res.data.invitationId, "CANCELLED");
      updateTransactionStatusNameTransaction(res.data.id, "CANCELLED");
      toast.success("Transaksi berhasil batalkan.");
    } catch (error: unknown) {
      handleError(error, "cancel transaction");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <CancelConfirmationModal
        isOpen={modalCancelOpen}
        onOpenChange={() => {
          setModalCancelOpen(false);
        }}
        onConfirm={onCancel}
        loading={cancelling}
      />
      <PaymentStatus
        invitationId={transaction?.invitationId || ""}
        groomName={transaction?.groomName || ""}
        brideName={transaction?.brideName || ""}
        amount={transaction?.amount || "0"}
        status={status}
        onPay={onPay}
        onCancel={() => setModalCancelOpen(true)}
        isLoading={loading}
        isCancelling={cancelling}
        isFetching={isFetching}
      />
    </>
  );
};

export default PaymentContent;
