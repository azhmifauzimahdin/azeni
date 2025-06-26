import { Bank } from "@/types";
import httpRequest from "./api";

export async function fetchBanks(): Promise<Bank[]> {
  const res = await httpRequest.get("/api/banks");
  return res.data;
}
