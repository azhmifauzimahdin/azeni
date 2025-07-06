import { Bank } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function fetchBanks(): Promise<ApiResponse<Bank[]>> {
  const res = await httpRequest.get("/api/banks");
  return res.data;
}
