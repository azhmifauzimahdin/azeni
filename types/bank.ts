export interface Bank {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankRequest {
  name: string;
  icon: string;
}
