export interface QuoteTemplate {
  id: string;
  name: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteTemplateRequest {
  name: string;
  author: string;
}
