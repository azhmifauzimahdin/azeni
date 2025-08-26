import { fromZonedTime, toZonedTime, formatInTimeZone } from "date-fns-tz";

const TIMEZONE_MAP: Record<"WIB" | "WITA" | "WIT", string> = {
  WIB: "Asia/Jakarta",
  WITA: "Asia/Makassar",
  WIT: "Asia/Jayapura",
};

function resolveTimezone(tz: "WIB" | "WITA" | "WIT"): string {
  return TIMEZONE_MAP[tz];
}

export function toUTC(
  dateInput: string | Date,
  timezone: "WIB" | "WITA" | "WIT"
): Date {
  return fromZonedTime(dateInput, resolveTimezone(timezone));
}

export function fromUTC(date: Date, timezone: "WIB" | "WITA" | "WIT"): Date {
  return toZonedTime(date, resolveTimezone(timezone));
}

export function formatInTimezone(
  date: Date,
  timezone: "WIB" | "WITA" | "WIT",
  fmt = "dd/MM/yyyy HH:mm"
): string {
  return formatInTimeZone(date, resolveTimezone(timezone), fmt);
}

export function parseDateRaw(date?: string | Date): Date {
  if (!date) return new Date();

  if (date instanceof Date) return date;

  // Backend format: "YYYY-MM-DD HH:mm:ss"
  const [year, month, day, hour, minute, second] = date
    .split(/[- :]/)
    .map(Number);

  // Buat Date lokal, jam tetap sama seperti string backend
  return new Date(year, month - 1, day, hour, minute, second);
}

const TIMEZONE_OFFSET: Record<"WIB" | "WITA" | "WIT", number> = {
  WIB: 7,
  WITA: 8,
  WIT: 9,
};

export function parseBackendDateToUTC(
  dateStr: string,
  tz: "WIB" | "WITA" | "WIT"
): Date {
  const [year, month, day, hour, minute, second] = dateStr
    .split(/[- :]/)
    .map(Number);
  // Kurangi offset timezone backend → dapat UTC
  return new Date(
    Date.UTC(year, month - 1, day, hour - TIMEZONE_OFFSET[tz], minute, second)
  );
}

export function isSameDate(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startDay = startDate.toISOString().split("T")[0];
  const endDay = endDate.toISOString().split("T")[0];

  return startDay === endDay;
}
