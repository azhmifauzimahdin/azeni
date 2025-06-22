import { generatePageMetadata } from "@/lib/metadata";
import QuoteContent from "./components/quote-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Quote" });

interface QuotePageProps {
  params: {
    id: string;
  };
}

export default function QuotePage({ params }: QuotePageProps) {
  return (
    <div className="space-y-4">
      <QuoteContent params={params} />
    </div>
  );
}
