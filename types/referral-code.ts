import { Transaction } from "./transaction";

export interface ReferralCode {
  id: string;
  code: string;
  description?: string;
  discount: string;
  isPercent: boolean;
  maxDiscount?: string;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;

  transactions: Transaction[];
  referralCodeLogs: ReferralCodeLog[];
}

export interface ReferralCodeRequest {
  code: string;
  description?: string;
  discount: string;
  isPercent: boolean;
  maxDiscount?: string;
  isActive: boolean;
}

export interface ReferralCodeLog {
  id: string;
  userId: string;
  userName: string;
  referralCodeId: string;
  oldDiscount: string | null;
  newDiscount: string | null;
  oldIsPercent: boolean | null;
  newIsPercent: boolean | null;
  oldMaxDiscount: string | null;
  newMaxDiscount: string | null;
  changedAt: string;
  createdAt: string;
  updatedAt: string;
}
