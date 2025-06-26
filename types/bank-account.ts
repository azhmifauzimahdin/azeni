import { Bank } from "./bank";

export interface BankAccountRequest {
  bankId: string;
  accountNumber: string;
  name: string;
}

export interface BankAccount {
  id: string;
  invitationId: string;
  bankId: string;
  accountNumber: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  bank: Bank;
}
