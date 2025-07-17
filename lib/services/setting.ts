import {
  Setting,
  SettingInvitationScanResetCountdownSecondsRequest,
  SettingInvitationStatusRequest,
  SettingRSVPRequest,
  SettingWaTemplateRequest,
} from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function updateRSVP(
  invitationId: string,
  request: SettingRSVPRequest
): Promise<ApiResponse<Setting>> {
  const res = await httpRequest.patch(
    `/api/invitations/${invitationId}/setting/rsvp`,
    request
  );

  return res.data;
}

export async function updateWaTemplate(
  invitationId: string,
  request: SettingWaTemplateRequest
): Promise<ApiResponse<Setting>> {
  const res = await httpRequest.patch(
    `/api/invitations/${invitationId}/setting/wa-template`,
    request
  );

  return res.data;
}

export async function updateInvitationStatus(
  invitationId: string,
  request: SettingInvitationStatusRequest
): Promise<ApiResponse<Setting>> {
  const res = await httpRequest.patch(
    `/api/invitations/${invitationId}/setting/activation`,
    request
  );

  return res.data;
}

export async function updateInvitationScanResetCountdownSeconds(
  invitationId: string,
  request: SettingInvitationScanResetCountdownSecondsRequest
): Promise<ApiResponse<Setting>> {
  const res = await httpRequest.patch(
    `/api/invitations/${invitationId}/setting/scan`,
    request
  );

  return res.data;
}
