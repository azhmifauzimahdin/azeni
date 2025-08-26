type Timezone = "WIB" | "WITA" | "WIT";

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
  timezone: Timezone;
  createdAt: string;
  updatedAt: string;
}
