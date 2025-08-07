import { Invitation, Schedule } from "@/types";

export function getEffectiveDate(invitation: Invitation): string {
  if (!invitation.useScheduleDate) {
    return invitation.date;
  }

  const validSchedules = invitation.schedules
    .map((s) => {
      const d = new Date(s.startDate);
      return isNaN(d.getTime()) ? null : { schedule: s, date: d };
    })
    .filter((v): v is { schedule: Schedule; date: Date } => v !== null);

  if (validSchedules.length === 0) {
    return invitation.date;
  }

  validSchedules.sort((a, b) => a.date.getTime() - b.date.getTime());
  return validSchedules[0].schedule.startDate;
}
