import { Quote, QuoteRequest } from "@/types";
import axios from "axios";

export async function createQuote(
  invitationId: string,
  request: QuoteRequest
): Promise<Quote> {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations/${invitationId}/quotes`,
    request
  );

  return res.data;
}
