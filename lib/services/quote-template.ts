import { QuoteTemplate, QuoteTemplateRequest } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function fetchQuoteTemplates(): Promise<
  ApiResponse<QuoteTemplate[]>
> {
  const res = await httpRequest.get("/api/quote-templates");
  return res.data;
}
export async function createQuoteTemplates(
  request: QuoteTemplateRequest
): Promise<ApiResponse<QuoteTemplate>> {
  const res = await httpRequest.post("/api/quote-templates", request);
  return res.data;
}
export async function updateQuoteTemplates(
  quoteId: string,
  request: QuoteTemplateRequest
): Promise<ApiResponse<QuoteTemplate>> {
  const res = await httpRequest.put(`/api/quote-templates/${quoteId}`, request);
  return res.data;
}
export async function deleteQuoteTemplates(
  quoteId: string
): Promise<ApiResponse<QuoteTemplate>> {
  const res = await httpRequest.delete(`/api/quote-templates/${quoteId}`);
  return res.data;
}
