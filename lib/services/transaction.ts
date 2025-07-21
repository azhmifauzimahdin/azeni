import { Transaction } from "@/types";
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
