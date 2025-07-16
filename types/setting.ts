export interface SettingWaTemplateRequest {
  whatsappMessageTemplate: string;
}

export interface SettingInvitationStatusRequest {
  invitationEnabled: boolean;
}
export interface SettingRSVPRequest {
  rsvpEnabled: boolean;
  rsvpMaxGuests: number;
  rsvpDeadline: Date;
  rsvpAllowNote: boolean;
}

export interface Setting {
  id: string;
  invitationId: string;
  invitationEnabled: boolean;
  rsvpEnabled: boolean;
  rsvpMaxGuests: number;
  rsvpDeadline: Date;
  rsvpAllowNote: boolean;
  whatsappMessageTemplate: string;
  createdAt: string;
  updatedAt: string;
  scanResetCountdownSeconds: number;
}
