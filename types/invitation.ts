import { BankAccount } from "./bank-account";
import { Comment } from "./comment";
import { Couple } from "./couple";
import { Gallery } from "./gallery";
import { Guest } from "./guest";
import { InvitationChange } from "./invitation-change";
import { LiveStream } from "./live-stream";
import { Music } from "./music";
import { Quote } from "./quote";
import { Schedule } from "./schedule";
import { Setting } from "./setting";
import { Story } from "./story";
import { Theme, ThemeBackground } from "./theme";
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
  useScheduleDate: boolean;
  status: boolean;
  isDefault: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  music: Music | null;
  transaction: Transaction;
  theme: Theme | null;
  quote: Quote | null;
  schedules: Schedule[];
  couple: Couple | null;
  liveStream: LiveStream | null;
  setting: Setting | null;
  stories: Story[];
  galleries: Gallery[];
  bankaccounts: BankAccount[];
  comments: Comment[];
  guests: Guest[];
  guest: Guest;
  invitationChanges: InvitationChange[];
  themeBackgrounds: ThemeBackground[] | null;
}
