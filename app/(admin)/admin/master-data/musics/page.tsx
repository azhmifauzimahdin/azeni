import { generatePageMetadata } from "@/lib/metadata";
import MusicsContent from "./components/musics-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Musik" });

export default function MusicsPage() {
  return (
    <div className="space-y-4">
      <MusicsContent />
    </div>
  );
}
