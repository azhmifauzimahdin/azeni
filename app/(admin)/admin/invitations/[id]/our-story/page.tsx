import { generatePageMetadata } from "@/lib/metadata";
import OurStoryContent from "./components/our-story-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Jadwal Acara" });

interface OurStoryProps {
  params: {
    id: string;
  };
}

export default function OurStory({ params }: OurStoryProps) {
  return (
    <div className="space-y-4">
      <OurStoryContent params={params} />
    </div>
  );
}
