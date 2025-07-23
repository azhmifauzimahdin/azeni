import { Theme } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function fetchThemesByInvitationId(
  invitationId: string
): Promise<ApiResponse<Theme[]>> {
  const res = await httpRequest.get(`/api/invitations/${invitationId}/theme`);
  return res.data;
}
export async function fetchThemes(): Promise<ApiResponse<Theme[]>> {
  const res = await httpRequest.get("/api/themes");
  return res.data;
}
