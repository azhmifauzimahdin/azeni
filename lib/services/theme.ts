import { Theme, ThemeRequest } from "@/types";
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

export async function createTheme(
  request: ThemeRequest
): Promise<ApiResponse<Theme>> {
  const res = await httpRequest.post("/api/themes", request);
  return res.data;
}
export async function updateTheme(
  themeId: string,
  request: ThemeRequest
): Promise<ApiResponse<Theme>> {
  const res = await httpRequest.put(`/api/themes/${themeId}`, request);
  return res.data;
}
export async function deleteTheme(
  themeId: string
): Promise<ApiResponse<Theme>> {
  const res = await httpRequest.delete(`/api/themes/${themeId}`);
  return res.data;
}
