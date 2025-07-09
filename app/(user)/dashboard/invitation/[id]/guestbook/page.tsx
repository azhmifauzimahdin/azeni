import { generatePageMetadata } from "@/lib/metadata";
import GuestBookContent from "./components/guestbook-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Buku Tamu" });

interface GuestBookProps {
  params: {
    id: string;
  };
}

export default function GuestBookPage({ params }: GuestBookProps) {
  return (
    <div className="space-y-4">
      <GuestBookContent params={params} />
    </div>
  );
}
