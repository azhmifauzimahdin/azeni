import { QuoteTemplate } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function fetchQuoteTemplates(): Promise<
  ApiResponse<QuoteTemplate[]>
> {
  const res = await httpRequest.get("/api/quote-templates");
  return res.data;
}
