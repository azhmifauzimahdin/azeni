import { LiveStream, LiveStreamRequest } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function upsertLiveStream(
  invitationId: string,
  request: LiveStreamRequest
): Promise<ApiResponse<LiveStream>> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/live-stream`,
    request
  );

  return res.data;
}
