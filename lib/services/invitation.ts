import { Invitation, InvitationRequest, Music } from "@/types";
import httpRequest from "./api";

export async function createInvitation(
  request: InvitationRequest
): Promise<Invitation> {
  const res = await httpRequest.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations`,
    request
  );

  return res.data;
}

export async function fetchInvitationByslug(slug: string): Promise<Invitation> {
  const res = await httpRequest.get(`/api/invitations/${slug}`);

  return res.data;
}

export async function fetchInvitationByUserId(
  userId: string
): Promise<Invitation[]> {
  const res = await httpRequest.get(`/api/invitations/user/${userId}`);
  return res.data;
}

export async function updateMusicByUserId(
  id: string,
  request: { musicId: string }
): Promise<Music> {
  const res = await httpRequest.patch(`/api/invitations/${id}/music`, request);
  return res.data;
}
