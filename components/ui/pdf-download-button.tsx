"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { Transaction } from "@/types";
import { TransactionReceipt } from "@/components/ui/transaction-receipt";
import React from "react";

interface PdfDownloadButtonProps {
  transaction: Transaction;
}

const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({
  transaction,
}) => {
  return (
    <PDFDownloadLink
      document={
        <TransactionReceipt
          data={transaction}
          logoUrl="/assets/img/azen-green-a.png"
          signatureUrl={undefined}
        />
      }
      fileName={`${transaction.orderId}.pdf`}
    >
      {({ loading }) => (
        <Button
          disabled={loading}
          variant="primary"
          className="rounded-full"
          size="sm"
        >
          <Wallet /> Bukti Pembayaran
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PdfDownloadButton;
