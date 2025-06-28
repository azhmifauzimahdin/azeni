import { generatePageMetadata } from "@/lib/metadata";
import CoupleContent from "./components/couple-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Pengantin" });

interface GiftPageProps {
  params: {
    id: string;
  };
}

export default function GiftPage({ params }: GiftPageProps) {
  return (
    <div className="space-y-4">
      <CoupleContent params={params} />
    </div>
  );
}
