export interface Transaction {
  id: string;
  orderId: string;
  invitationId: string;
  invitationSlug: string;
  groomName: string;
  brideName: string;
  originalAmount: string;
  amount: string;
  referralDiscountAmount: string;
  date: string;
  snapToken: string;
  redirectUrl: string;
  midtransPdfUrl: string;
  isActive: boolean;
  statusId: string;
  referralCodeId: string;
  referralCode: ReferralCode;
  updatedAt: string;
  createdAt: string;
  webhookLogs: WebhookLog[];
  status: {
    id: string;
    name:
      | "CREATED"
      | "PENDING"
      | "SUCCESS"
      | "FAILED"
      | "CANCELLED"
      | "REFUNDED";
  };
}

export interface WebhookLog {
  id: string;
  orderId: string;
  transactionStatus: string;
  paymentType: string;
  fraudStatus: string | null;
  bank: string | null;
  vaNumber: string | null;
  store: string | null;
  paymentCode: string | null;
  expiredAt: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawBody: Record<string, any>;
  eventAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralCode {
  id: string;
  code: string;
  discount: string;
  isPercent: boolean;
  maxDiscount: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
