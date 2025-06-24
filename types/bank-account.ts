import { Bank } from "./bank";

export interface BankAccount {
  id: string;
  invitationId: string;
  bankId: Bank;
  nomor: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  bank: Bank;
}
