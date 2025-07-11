import { Setting, SettingRSVPRequest } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function updateRSVP(
  invitationId: string,
  request: SettingRSVPRequest
): Promise<ApiResponse<Setting>> {
  const res = await httpRequest.put(
    `/api/invitations/${invitationId}/setting/rsvp`,
    request
  );

  return res.data;
}
