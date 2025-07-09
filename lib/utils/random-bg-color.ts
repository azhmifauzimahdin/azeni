export function getRandomBgColor(): string {
  const colors = [
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
  ];

  const levels = ["500", "600", "700"];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomLevel = levels[Math.floor(Math.random() * levels.length)];

  return `bg-${randomColor}-${randomLevel}`;
}
