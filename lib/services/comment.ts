import { CommentFormValues } from "@/schemas";
import { Comment } from "@/types";
import axios from "axios";

export async function postComment(
  invitationId: string,
  request: CommentFormValues & { guestId: string }
): Promise<Comment> {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations/${invitationId}/comments`,
    request
  );
  return res.data;
}
