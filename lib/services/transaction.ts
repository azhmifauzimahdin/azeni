import { Guest, Setting, Theme, Transaction } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function reOrderTransaction(
  invitationId: string
): Promise<ApiResponse<Transaction>> {
  const res = await httpRequest.patch(
    `/api/invitations/${invitationId}/transaction/reorder`
  );

  return res.data;
}

export async function cancelTransaction(
  invitationId: string
): Promise<ApiResponse<Transaction>> {
  const res = await httpRequest.patch(
    `/api/invitations/${invitationId}/transaction/cancel`
  );

  return res.data;
}
export async function fetchTransactionByUserId(
  userId: string
): Promise<ApiResponse<Transaction[]>> {
  const res = await httpRequest.get(
    `/api/invitations/user/${userId}/transactions`
  );

  return res.data;
}

export async function fetchTransactionByInvitationId(
  invitationId: string
): Promise<ApiResponse<Transaction>> {
  const res = await httpRequest.get(
    `/api/invitations/${invitationId}/transaction`
  );

  return res.data;
}

export async function fetchTransactionByOrderId(
  invitationId: string
): Promise<ApiResponse<Transaction>> {
  const res = await httpRequest.get(
    `/api/invitations/${invitationId}/transaction/check`
  );

  return res.data;
}

export async function selectThemeByInvitationId(
  invitationId: string,
  request: {
    themeId: string;
  }
): Promise<
  ApiResponse<{
    theme: Theme;
    transaction: Transaction;
  }>
> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/transaction/theme`,
    request
  );

  return res.data;
}

export async function applyReferralByInvitationId(
  invitationId: string,
  request: {
    referralCode: string;
  }
): Promise<ApiResponse<Transaction>> {
  const res = await httpRequest.patch(
    `/api/invitations/${invitationId}/transaction/referral`,
    request
  );

  return res.data;
}

export async function checkoutByInvitationId(invitationId: string): Promise<
  ApiResponse<{
    transaction: Transaction;
    guest: Guest;
    setting: Setting;
  }>
> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/transaction/checkout`
  );

  return res.data;
}
