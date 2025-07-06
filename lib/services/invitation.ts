import { Invitation, InvitationRequest, Music, Theme } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function createInvitation(
  request: InvitationRequest
): Promise<ApiResponse<Invitation>> {
  const res = await httpRequest.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations`,
    request
  );

  return res.data;
}

export async function fetchInvitationByslug(
  slug: string
): Promise<ApiResponse<Invitation>> {
  const res = await httpRequest.get(`/api/invitations/${slug}`);

  return res.data;
}

export async function fetchInvitationById(
  id: string
): Promise<ApiResponse<Invitation>> {
  const res = await httpRequest.get(`/api/invitations/${id}`);

  return res.data;
}

export async function fetchInvitationByUserId(
  userId: string
): Promise<ApiResponse<Invitation[]>> {
  const res = await httpRequest.get(`/api/invitations/user/${userId}`);
  return res.data;
}

export async function updateMusicByUserId(
  id: string,
  request: { musicId: string }
): Promise<ApiResponse<Music>> {
  const res = await httpRequest.patch(`/api/invitations/${id}/music`, request);
  return res.data;
}

export async function updateThemeByUserId(
  id: string,
  request: { themeId: string }
): Promise<ApiResponse<Theme>> {
  const res = await httpRequest.patch(`/api/invitations/${id}/theme`, request);
  return res.data;
}
