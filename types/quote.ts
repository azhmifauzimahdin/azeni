export interface QuoteRequest {
  name: string;
  author: string;
}

export interface Quote {
  id: string;
  name: string;
  author: string;
  invitationId: string;
  createdAt: string;
  updatedAt: string;
}
