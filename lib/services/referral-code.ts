import {
  BalanceReferralCode,
  ReferralCode,
  ReferralCodeRequest,
  ReferralWithdrawal,
  RequestReferralWithdrawal,
  RequestUpdateStatusReferralWithdrawal,
} from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function fetchReferralCodeByUserId(): Promise<
  ApiResponse<ReferralCode>
> {
  const res = await httpRequest.get("/api/referral");
  return res.data;
}

export async function generateCodeByUserId(): Promise<
  ApiResponse<ReferralCode>
> {
  const res = await httpRequest.post("/api/referral");
  return res.data;
}

export async function fetchBalanceReferralCodeByUserId(): Promise<
  ApiResponse<BalanceReferralCode>
> {
  const res = await httpRequest.get("/api/referral/balance");
  return res.data;
}

export async function fetchReferralWithdrawalByUserId(): Promise<
  ApiResponse<ReferralWithdrawal[]>
> {
  const res = await httpRequest.get("/api/referral/withdrawal");
  return res.data;
}

export async function createReferralCodeWithdrawal(
  request: RequestReferralWithdrawal
): Promise<ApiResponse<ReferralWithdrawal>> {
  const res = await httpRequest.post("/api/referral/withdrawal", request);
  return res.data;
}

export async function createReferralCodeWithdrawalById(
  id: string,
  request: RequestReferralWithdrawal
): Promise<ApiResponse<ReferralWithdrawal>> {
  const res = await httpRequest.post(`/api/referral/${id}/withdrawal`, request);
  return res.data;
}

export async function updateStatusReferralCodeWithdrawal(
  id: string,
  request: RequestUpdateStatusReferralWithdrawal
): Promise<
  ApiResponse<{ withdrawal: ReferralWithdrawal; referralCode: ReferralCode }>
> {
  const res = await httpRequest.patch(
    `/api/referral/withdrawal/${id}`,
    request
  );
  return res.data;
}

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
