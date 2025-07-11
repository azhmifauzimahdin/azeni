export interface SettingRSVPRequest {
  rsvpEnabled: boolean;
  rsvpMaxGuests: number;
  rsvpDeadline: Date;
  rsvpAllowNote: boolean;
}

export interface Setting {
  id: string;
  invitationId: string;
  rsvpEnabled: boolean;
  rsvpMaxGuests: number;
  rsvpDeadline: Date;
  rsvpAllowNote: boolean;
  whatsappMessageTemplate: string;
  createdAt: string;
  updatedAt: string;
}
