import { Guest } from "./guest";

export interface Comment {
  id: string;
  invitationId: string;
  guestId: string;
  guest: Guest;
  message: string;
  createdAt: string;
  updatedAt: string;
}
