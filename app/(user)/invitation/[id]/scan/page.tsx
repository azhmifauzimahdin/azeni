import { generatePageMetadata } from "@/lib/metadata";
import ScanContent from "./components/scan-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Check-in Check-out" });

interface ScanProps {
  params: {
    id: string;
  };
}

export default function ScanPage({ params }: ScanProps) {
  return (
    <div className="space-y-4">
      <ScanContent params={params} />
    </div>
  );
}
