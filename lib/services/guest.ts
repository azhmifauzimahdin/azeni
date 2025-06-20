import { Guest } from "@/types";
import httpRequest from "./api";

export async function fetchGuestById(
  InvitationId: string,
  id: string
): Promise<Guest> {
  const res = await httpRequest.get(
    `/api/invitations/${InvitationId}/guest/${id}`
  );
  return res.data;
}
