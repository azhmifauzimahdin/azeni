import { BankAccount, BankAccountRequest } from "@/types";
import httpRequest from "./api";

export async function createAddress(
  invitationId: string,
  request: { address: string }
): Promise<BankAccount> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/gift/address`,
    request
  );

  return res.data;
}

export async function updateAddress(
  invitationId: string,
  addressId: string,
  request: { address: string }
): Promise<BankAccount> {
  const res = await httpRequest.put(
    `/api/invitations/${invitationId}/gift/address/${addressId}`,
    request
  );

  return res.data;
}

export async function deleteAddress(
  invitationId: string,
  addressId: string
): Promise<BankAccount> {
  const res = await httpRequest.delete(
    `/api/invitations/${invitationId}/gift/address/${addressId}`
  );

  return res.data;
}

export async function createBank(
  invitationId: string,
  request: BankAccountRequest
): Promise<BankAccount> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/gift`,
    request
  );

  return res.data;
}

export async function updateBank(
  invitationId: string,
  giftId: string,
  request: BankAccountRequest
): Promise<BankAccount> {
  const res = await httpRequest.put(
    `/api/invitations/${invitationId}/gift/${giftId}`,
    request
  );

  return res.data;
}

export async function deleteBank(
  invitationId: string,
  bankAccountId: string
): Promise<BankAccount> {
  const res = await httpRequest.delete(
    `/api/invitations/${invitationId}/gift/address/${bankAccountId}`
  );

  return res.data;
}
