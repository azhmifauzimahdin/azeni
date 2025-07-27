import { generatePageMetadata } from "@/lib/metadata";
import MusicContent from "./components/music-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Musik" });

interface MusicPageProps {
  params: {
    id: string;
  };
}

export default function MusicPage({ params }: MusicPageProps) {
  return (
    <div className="space-y-4">
      <MusicContent params={params} />
    </div>
  );
}
