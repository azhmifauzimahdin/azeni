export interface Schedule {
  id: string;
  invitationId: string;
  type: "marriage" | "reception";
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  location_maps: string;
  createdAt: string;
  updatedAt: string;
}
