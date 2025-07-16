import { Guest, GuestRequest } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function createGuest(
  invitationId: string,
  request: GuestRequest
): Promise<ApiResponse<Guest>> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/guest`,
    request
  );

  return res.data;
}

export async function importGuest(
  invitationId: string,
  file: File
): Promise<ApiResponse<Guest[]>> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/guest/import`,
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    }
  );

  return res.data;
}

export async function updateGuest(
  invitationId: string,
  guestId: string,
  request: GuestRequest
): Promise<ApiResponse<Guest>> {
  const res = await httpRequest.put(
    `/api/invitations/${invitationId}/guest/${guestId}`,
    request
  );

  return res.data;
}

export async function deleteGuest(
  invitationId: string,
  guestId: string
): Promise<ApiResponse<Guest>> {
  const res = await httpRequest.delete(
    `/api/invitations/${invitationId}/guest/${guestId}`
  );

  return res.data;
}

export async function checkInGuest(
  invitationId: string,
  guestId: string
): Promise<
  ApiResponse<{
    id: string;
    name: string;
    isCheckedIn: string;
    checkedInAt: string;
  }>
> {
  const res = await httpRequest.put(
    `/api/invitations/${invitationId}/guest/${guestId}/checkin`
  );

  return res.data;
}
export async function checkOutGuest(
  invitationId: string,
  guestId: string
): Promise<ApiResponse<{ id: string; name: string; checkedOutAt: string }>> {
  const res = await httpRequest.put(
    `/api/invitations/${invitationId}/guest/${guestId}/checkout`
  );

  return res.data;
}

export async function checkInOutGuest(
  invitationId: string,
  code: string
): Promise<
  ApiResponse<{
    id: string;
    name: string;
    date: string;
    status: "checkin" | "checkout" | null;
  }>
> {
  const res = await httpRequest.put(
    `/api/invitations/${invitationId}/guest/${code}/check`
  );

  return res.data;
}

export async function fetchGuestByCode(
  InvitationId: string,
  id: string
): Promise<ApiResponse<Guest>> {
  const res = await httpRequest.get(
    `/api/invitations/${InvitationId}/guest/${id}`
  );
  return res.data;
}
