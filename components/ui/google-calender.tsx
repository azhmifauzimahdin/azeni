import Link from "next/link";
import { format } from "date-fns";
import { CalendarCheck } from "lucide-react";

type CalendarEvent = {
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
};
const GoogleCalender: React.FC<CalendarEvent> = ({
  title,
  description,
  location,
  startTime,
  endTime,
}) => {
  const fixDateFormat = (str: string) => str.replace(" ", "T");

  const startLocal = new Date(fixDateFormat(startTime));
  const endLocal = new Date(fixDateFormat(endTime));

  const startUtc = new Date(startLocal.getTime() - 7 * 60 * 60 * 1000);
  const endUtc = new Date(endLocal.getTime() - 7 * 60 * 60 * 1000);

  const start = format(startUtc, "yyyyMMdd'T'HHmmss'Z'");
  const end = format(endUtc, "yyyyMMdd'T'HHmmss'Z'");

  const url = new URL("https://www.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", title);
  if (description) url.searchParams.set("details", description);
  if (location) url.searchParams.set("location", location);
  url.searchParams.set("dates", `${start}/${end}`);
  return (
    <Link
      href={url.toString()}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary transition"
    >
      <CalendarCheck size={16} /> Simpan ke kalender
    </Link>
  );
};

export default GoogleCalender;
