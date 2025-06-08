import {
  Home,
  CalendarCheck,
  BookText,
  GalleryHorizontalEnd,
} from "lucide-react";

export const navLinks = [
  {
    href: "#hero",
    icon: <Home className="w-5 h-5" />,
    label: "Home",
  },
  {
    href: "#schedule",
    icon: <CalendarCheck className="w-5 h-5" />,
    label: "Schedule",
  },
  {
    href: "#story",
    icon: <BookText className="w-5 h-5" />,
    label: "Story",
  },
  {
    href: "#galleries",
    icon: <GalleryHorizontalEnd className="w-5 h-5" />,
    label: "Galleries",
  },
];
