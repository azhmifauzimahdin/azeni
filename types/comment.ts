import { Guest } from "./guest";

export interface Comment {
  id: string;
  invitationId: string;
  guestId: string;
  guest: Guest;
  message: string;
  parentId?: string;
  isReply: boolean;
  replyToName?: string;
  parent?: Comment;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}
