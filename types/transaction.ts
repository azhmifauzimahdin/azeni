export interface Transaction {
  id: string;
  orderId: string;
  invitationId: string;
  invitationSlug: string;
  groomName: string;
  brideName: string;
  amount: string;
  date: string;
  snapToken: string;
  redirectUrl: string;
  midtransPdfUrl:  string;
  isActive: boolean;
  statusId: string;
  updatedAt: string;
  createdAt: string;
  webhookLogs: WebhookLog[];
  status: {
    id: string;
    name: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED";
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
