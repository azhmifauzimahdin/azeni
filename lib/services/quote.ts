import { Quote, QuoteRequest } from "@/types";
import httpRequest from "./api";

export async function createQuote(
  invitationId: string,
  request: QuoteRequest
): Promise<Quote> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/quote`,
    request
  );

  return res.data;
}

export async function deleteQuote(
  invitationId: string,
  quoteId: string
): Promise<Quote> {
  const res = await httpRequest.delete(
    `/api/invitations/${invitationId}/quote/${quoteId}`
  );

  return res.data;
}
