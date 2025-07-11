export function getJustifyClass(className?: string) {
  if (!className) return "justify-start";
  if (className.includes("text-center")) return "justify-center";
  if (className.includes("text-right")) return "justify-end";
  return "justify-start";
}
