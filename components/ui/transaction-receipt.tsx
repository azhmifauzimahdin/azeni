/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Transaction, WebhookLog } from "@/types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const formatIDR = (v: string | number) =>
  "Rp" + Number(v ?? 0).toLocaleString("id-ID");

const formatDate = (v?: string | null) =>
  v ? new Date(v).toLocaleString("id-ID") : "-";

function getFinalLog(webhookLogs: WebhookLog[] = []) {
  return (
    webhookLogs.find((l) => l.transactionStatus === "settlement") ??
    webhookLogs[0] ??
    null
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    color: "#1F2937",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#008080",
    marginBottom: 8,
  },
  section: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottom: "1px solid #E5E7EB",
  },
  labelTitle: {
    marginBottom: 6,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    width: "40%",
    color: "#374151",
  },
  value: {
    width: "60%",
    textAlign: "right",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#6B7280",
  },
  signatureWrap: {
    marginTop: 24,
    alignItems: "flex-end",
  },
  signature: {
    width: 100,
    height: 40,
    marginTop: 8,
  },
});

export interface TransactionReceiptProps {
  data: Transaction;
  logoUrl?: string;
  signatureUrl?: string;
}

export function TransactionReceipt({
  data,
  logoUrl,
  signatureUrl,
}: TransactionReceiptProps) {
  const log = getFinalLog(data.webhookLogs);
  const bank =
    log?.paymentType === "bank_transfer" ? log?.bank?.toUpperCase() : undefined;
  const themeDiscount =
    Number(data.originalAmount) -
    Number(data.amount) -
    (Number(data.referralDiscountAmount) ?? 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
          <Text style={styles.title}>Bukti Pembayaran</Text>
          <Text>{data.orderId}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.labelTitle}>Informasi Pemesan</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nama</Text>
            <Text style={styles.value}>
              {data.groomName} & {data.brideName}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Slug Undangan</Text>
            <Text style={styles.value}>{data.invitationSlug}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tanggal Transaksi</Text>
            <Text style={styles.value}>{formatDate(data.date)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{data.status?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Kode Referral</Text>
            <Text style={styles.value}>{data.referralCode?.code ?? "-"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.labelTitle}>Ringkasan Pembayaran</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Harga Awal</Text>
            <Text style={styles.value}>{formatIDR(data.originalAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Diskon Tema</Text>
            <Text style={styles.value}>- {formatIDR(themeDiscount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Diskon Referral</Text>
            <Text style={styles.value}>
              - {formatIDR(data.referralDiscountAmount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Dibayar</Text>
            <Text style={styles.value}>{formatIDR(data.amount)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.labelTitle}>Metode Pembayaran</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Metode</Text>
            <Text style={styles.value}>
              {bank ? `Transfer Bank (${bank})` : log?.paymentType ?? "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dibayar pada</Text>
            <Text style={styles.value}>{formatDate(log?.eventAt)}</Text>
          </View>
        </View>

        {signatureUrl ? (
          <View style={styles.signatureWrap}>
            <Text>Hormat kami,</Text>
            <Image src={signatureUrl} style={styles.signature} />
          </View>
        ) : null}

        <View style={styles.footer}>
          <Text>Terima kasih telah melakukan pembayaran.</Text>
          <Text>
            Dokumen ini dicetak otomatis dan tidak memerlukan tanda tangan
            basah.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
