import { generatePageMetadata } from "@/lib/metadata";
import ScheduleContent from "./components/schedule-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Jadwal Acara" });

interface SchedulePageProps {
  params: {
    id: string;
  };
}

export default function SchedulePage({ params }: SchedulePageProps) {
  return (
    <div className="space-y-4">
      <ScheduleContent params={params} />
    </div>
  );
}
