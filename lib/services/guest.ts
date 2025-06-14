import { Guest } from "@/types";
import axios from "axios";

export async function fetchGuestById(
  InvitationId: string,
  id: string
): Promise<Guest> {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations/${InvitationId}/guests/${id}`
  );
  return res.data;
}
