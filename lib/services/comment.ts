import { CommentFormValues } from "@/components/ui/comment";
import { Comment } from "@/types";
import httpRequest from "./api";

export async function postComment(
  invitationId: string,
  request: CommentFormValues & { guestId: string }
): Promise<Comment> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/comments`,
    request
  );
  return res.data;
}
