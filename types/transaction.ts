export interface Transaction {
  id: string;
  invitationId: string;
  invitationSlug: string;
  groomName: string;
  brideName: string;
  amount: string;
  date: string;
  statusId: string;
  status: {
    id: string;
    name: string;
  };
}
