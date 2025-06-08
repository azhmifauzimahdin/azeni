export function formatTime(date: string): string {
  if (!date) return "";

  const newDate = new Date(date);

  const jam = newDate.getHours().toString().padStart(2, "0");
  const menit = newDate.getMinutes().toString().padStart(2, "0");

  return `${jam}:${menit}`;
}
