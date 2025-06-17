export interface Transaction {
  id: string;
  invitationId: string;
  amount: string;
  date: string;
  statusId: string;
  status: {
    id: string;
    name: string;
  };
}
