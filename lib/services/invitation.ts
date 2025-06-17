import { Invitation, InvitationRequest } from "@/types";
import axios from "axios";

export async function createInvitation(
  request: InvitationRequest
): Promise<Invitation> {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations`,
    request
  );

  return res.data;
}

export async function fetchInvitationByslug(slug: string): Promise<Invitation> {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations/${slug}`
  );

  return res.data;
}

export async function fetchInvitationByUserId(
  userId: string
): Promise<Invitation[]> {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations/user/${userId}`
  );
  return res.data;
}
