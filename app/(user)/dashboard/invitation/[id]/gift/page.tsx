import { generatePageMetadata } from "@/lib/metadata";
import GiftContent from "./components/gift-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Kado" });

interface GiftPageProps {
  params: {
    id: string;
  };
}

export default function GiftPage({ params }: GiftPageProps) {
  return (
    <div className="space-y-4">
      <GiftContent params={params} />
    </div>
  );
}
