import { ReferralCode } from "@/types";
import httpRequest, { ApiResponse } from "./api";
import { ReferralCodeRequest } from "@/types/referral";

export async function fetchReferralCodes(): Promise<
  ApiResponse<ReferralCode[]>
> {
  const res = await httpRequest.get("/api/referrals");
  return res.data;
}
export async function createReferralCode(
  request: ReferralCodeRequest
): Promise<ApiResponse<ReferralCode>> {
  const res = await httpRequest.post("/api/referrals", request);
  return res.data;
}
export async function updateReferralCode(
  referralCodeId: string,
  request: ReferralCodeRequest
): Promise<ApiResponse<ReferralCode>> {
  const res = await httpRequest.put(
    `/api/referrals/${referralCodeId}`,
    request
  );
  return res.data;
}
export async function deleteReferralCode(
  referralCodeId: string
): Promise<ApiResponse<ReferralCode>> {
  const res = await httpRequest.delete(`/api/referrals/${referralCodeId}`);
  return res.data;
}
