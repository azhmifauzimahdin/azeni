import { Schedule, ScheduleRequest } from "@/types";
import httpRequest from "./api";

export async function createSchedule(
  invitationId: string,
  request: ScheduleRequest
): Promise<Schedule> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/schedules`,
    request
  );

  return res.data;
}

export async function updateSchedule(
  invitationId: string,
  scheduleId: string,
  request: ScheduleRequest
): Promise<Schedule> {
  const res = await httpRequest.put(
    `/api/invitations/${invitationId}/schedules/${scheduleId}`,
    request
  );

  return res.data;
}

export async function deleteSchedule(
  invitationId: string,
  scheduleId: string
): Promise<Schedule> {
  const res = await httpRequest.delete(
    `/api/invitations/${invitationId}/schedules/${scheduleId}`
  );

  return res.data;
}
