export interface ScheduleRequest {
  name: string;
  startDate: Date;
  endDate: Date;
  timezone: string;
  location: string;
  locationMaps: string;
}

export interface Schedule {
  id: string;
  invitationId: string;
  type: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  locationMaps: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}
