"use client";

import { AlertCircle, Ban, Ghost, Home, Timer } from "lucide-react";
import "aos/dist/aos.css";
import { LinkButton } from "../ui/link";
import { Img } from "../ui/Img";

interface NotFoundProps {
  message: string;
  type?: "theme" | "guest" | "inactive" | "expired";
  imageUrl?: string;
}

const ICONS = {
  theme: Ghost,
  guest: AlertCircle,
  expired: Timer,
  inactive: Ban,
};

const DEFAULT_BACKGROUND = "/assets/img/bg-hero.jpg";

const NotFound: React.FC<NotFoundProps> = ({
  message,
  type = "guest",
  imageUrl,
}) => {
  const Icon = ICONS[type] || AlertCircle;
  const backgroundImage =
    type === "inactive" && imageUrl ? imageUrl : DEFAULT_BACKGROUND;

  return (
    <div className="relative w-full h-[calc(var(--vh,1vh)_*_100)] flex items-center justify-center overflow-hidden p-3">
      <Img
        src={backgroundImage}
        alt="Invitation background"
        className="object-cover"
        wrapperClassName="absolute inset-0 z-0"
        priority
      />

      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm z-10" />

      <div
        className="relative z-20 max-w-xl mx-auto p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl text-center text-white space-y-4"
        data-aos="fade-up"
      >
        <div className="flex justify-center">
          <Icon className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-xl font-semibold">{message}</h2>
        <p className="text-sm text-white/80">
          Silakan kembali atau hubungi pengirim undangan.
        </p>

        <LinkButton href="/" variant="secondary" className="rounded-full">
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </LinkButton>
      </div>
    </div>
  );
};

export default NotFound;
