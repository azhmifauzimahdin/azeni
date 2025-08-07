export interface SettingWaTemplateRequest {
  whatsappMessageTemplate: string;
}

export interface SettingInvitationStatusRequest {
  invitationEnabled: boolean;
}

export interface SettingInvitationScanResetCountdownSecondsRequest {
  scanResetCountdownSeconds: number;
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
  commentEnabled: boolean;
  whatsappMessageTemplate: string;
  scanResetCountdownSeconds: number;
  checkinCheckoutEnabled: boolean;
  coupleIntroductionText: string;
  scheduleIntroductionText: string;
  giftIntroductionText: string;
  createdAt: string;
  updatedAt: string;
}
