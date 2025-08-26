import { Invitation } from "./invitation";

export interface LiveStreamRequest {
  startDate: Date;
  endDate: Date;
  urlYoutube?: string;
  urlInstagram?: string;
  urlFacebook?: string;
  urlTiktok?: string;
  urlZoom?: string;
  urlCustom?: string;
  description?: string;
}
export interface LiveStream {
  id: string;
  invitationId: string;
  startDate: string;
  endDate: string;
  urlYoutube: string;
  urlInstagram: string;
  urlFacebook: string;
  urlTiktok: string;
  urlZoom: string;
  urlCustom: string;
  description: string;
  createdAt: string;
  updatedAt: string;

  invitation?: Invitation;
}
