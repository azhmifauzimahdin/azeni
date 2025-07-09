export interface GuestRequest {
  name: string;
  group?: string;
  address?: string;
}
export interface Guest {
  id: string;
  code: string;
  invitationId: string;
  name: string;
  group: string;
  address: string;
  color: string;
  isAttending: boolean;
  confirmedAt: string;
  totalGuests: string;
  notes: string;
  isCheckedIn: boolean;
  checkedInAt: string;
  checkedOutAt: string;
  createdAt: string;
  updatedAt: string;
}
