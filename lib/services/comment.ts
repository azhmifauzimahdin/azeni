import { CommentFormValues } from "@/components/ui/comment";
import { Comment } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function postComment(
  invitationId: string,
  request: CommentFormValues & { guestId: string }
): Promise<ApiResponse<Comment>> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/comments`,
    request
  );
  return res.data;
}

export async function deleteComment(
  invitationId: string,
  commentId: string
): Promise<ApiResponse<Comment>> {
  const res = await httpRequest.delete(
    `/api/invitations/${invitationId}/comments/${commentId}`
  );
  return res.data;
}
