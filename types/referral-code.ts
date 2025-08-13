import { Bank } from "./bank";
import { Transaction } from "./transaction";

export interface ReferralCode {
  id: string;
  userId: string;
  userName: string;
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
  withdrawals: ReferralWithdrawal[];
  balance: BalanceReferralCode;
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

export enum WithdrawalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface ReferralWithdrawal {
  id: string;
  referralCodeId: string;
  amount: string;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt: string | null;
  bankId: string;
  accountNumber: string;
  name: string;
  note: string | null;
  transferProofUrl: string | null;
  createdAt: string;
  updatedAt: string;

  referralCode: ReferralCode;
  bank: Bank;
}

export interface BalanceReferralCode {
  totalReward: string;
  totalWithdrawn: string;
  availableBalance: string;
}

export interface RequestReferralWithdrawal {
  amount: string;
  bankId: string;
  accountNumber: string;
  name: string;
  note?: string;
}
export interface RequestUpdateStatusReferralWithdrawal {
  status: "APPROVED" | "REJECTED";
  transferProofUrl?: string;
  note?: string;
}
