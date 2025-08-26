import { generatePageMetadata } from "@/lib/metadata";
import LiveStreamContent from "./components/live-stream-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Streaming" });

interface StreamingPageProps {
  params: {
    id: string;
  };
}

export default function StreamingPage({ params }: StreamingPageProps) {
  return (
    <div className="space-y-4">
      <LiveStreamContent params={params} />
    </div>
  );
}
