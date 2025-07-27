import { generatePageMetadata } from "@/lib/metadata";
import GalleryContent from "./components/gallery-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Galeri" });

interface SchedulePageProps {
  params: {
    id: string;
  };
}

export default function SchedulePage({ params }: SchedulePageProps) {
  return (
    <div className="space-y-4">
      <GalleryContent params={params} />
    </div>
  );
}
