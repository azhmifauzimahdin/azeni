import { Bank, BankRequest } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function fetchBanks(): Promise<ApiResponse<Bank[]>> {
  const res = await httpRequest.get("/api/banks");
  return res.data;
}
export async function createBank(
  request: BankRequest
): Promise<ApiResponse<Bank>> {
  const res = await httpRequest.post("/api/banks", request);
  return res.data;
}
export async function updateBank(
  bankId: string,
  request: BankRequest
): Promise<ApiResponse<Bank>> {
  const res = await httpRequest.put(`/api/banks/${bankId}`, request);
  return res.data;
}
export async function deleteBank(bankId: string): Promise<ApiResponse<Bank>> {
  const res = await httpRequest.delete(`/api/banks/${bankId}`);
  return res.data;
}
