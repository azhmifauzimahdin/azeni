import { bank } from "./bank";

export interface BankAccount {
  id: string;
  invitationId: string;
  bankId: string;
  nomor: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  bank: bank;
}
