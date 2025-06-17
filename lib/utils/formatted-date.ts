import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(
  date: string,
  formatString: string = "EEEE dd MMMM yyyy"
): string {
  if (!date) return "";

  const isoString = date.replace(" ", "T"); // ubah ke ISO yang valid
  const parsedDate = parseISO(isoString);

  return format(parsedDate, formatString, { locale: id });
}
