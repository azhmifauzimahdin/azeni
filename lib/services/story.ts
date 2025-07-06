import { Story, StoryRequest } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function createStory(
  invitationId: string,
  request: StoryRequest
): Promise<ApiResponse<Story>> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/stories`,
    request
  );

  return res.data;
}

export async function updateStory(
  invitationId: string,
  StoryId: string,
  request: StoryRequest
): Promise<ApiResponse<Story>> {
  const res = await httpRequest.put(
    `/api/invitations/${invitationId}/stories/${StoryId}`,
    request
  );

  return res.data;
}

export async function deleteStory(
  invitationId: string,
  storyId: string
): Promise<ApiResponse<Story>> {
  const res = await httpRequest.delete(
    `/api/invitations/${invitationId}/stories/${storyId}`
  );

  return res.data;
}
