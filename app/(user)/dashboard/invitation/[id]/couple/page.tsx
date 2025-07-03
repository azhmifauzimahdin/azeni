import { generatePageMetadata } from "@/lib/metadata";
import CoupleContent from "./components/couple-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Pengantin" });

interface CouplePageProps {
  params: {
    id: string;
  };
}

export default function CouplePage({ params }: CouplePageProps) {
  return (
    <div className="space-y-4">
      <CoupleContent params={params} />
    </div>
  );
}
