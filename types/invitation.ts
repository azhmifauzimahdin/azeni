import { BankAccount } from "./bank-account";
import { Comment } from "./comment";
import { Couple } from "./couple";
import { Gallery } from "./gallery";
import { Guest } from "./guest";
import { Music } from "./music";
import { Quote } from "./quote";
import { Schedule } from "./schedule";
import { Story } from "./story";
import { Theme } from "./theme";
import { Transaction } from "./transaction";

export interface InvitationRequest {
  groom: string;
  bride: string;
  slug: string;
  themeId: string;
  image: string;
  date: Date;
  expiresAt: Date;
}

export interface Invitation {
  id: string;
  userId: string;
  groom: string;
  bride: string;
  slug: string;
  themeId: string;
  musicId: string;
  image: string;
  date: string;
  status: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  music: Music;
  transaction: Transaction;
  theme: Theme;
  quote: Quote | null;
  schedules: Schedule[];
  couple: Couple | null;
  stories: Story[];
  galleries: Gallery[];
  bankaccounts: BankAccount[];
  comments: Comment[];
  guest: Guest;
}
