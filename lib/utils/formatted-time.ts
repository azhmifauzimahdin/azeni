import { formatInTimeZone } from "date-fns-tz";

function resolveTimezone(tz?: "WIB" | "WITA" | "WIT"): string | null {
  if (!tz) return null;
  switch (tz) {
    case "WIB":
      return "Asia/Jakarta";
    case "WITA":
      return "Asia/Makassar";
    case "WIT":
      return "Asia/Jayapura";
    default:
      return null;
  }
}

export function formatTime(
  date: string | Date,
  timezone?: "WIB" | "WITA" | "WIT"
): string {
  if (!date) return "";

  const tz = resolveTimezone(timezone);
  if (tz) {
    // kalau ada acuan timezone (WIB/WITA/WIT)
    return formatInTimeZone(date, tz, "HH:mm");
  } else {
    // kalau tidak ada timezone → pakai timezone client
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(date));
  }
}
