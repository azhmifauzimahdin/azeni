import { generatePageMetadata } from "@/lib/metadata";
import RSVPContent from "./components/rsvp-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "RSVP" });

interface GuestBookProps {
  params: {
    id: string;
  };
}

export default function GuestBookPage({ params }: GuestBookProps) {
  return (
    <div className="space-y-4">
      <RSVPContent params={params} />
    </div>
  );
}
