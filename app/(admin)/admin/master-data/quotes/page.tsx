import { generatePageMetadata } from "@/lib/metadata";
import QuotesContent from "./components/quotes-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Quote" });

export default function QuotePage() {
  return (
    <div className="space-y-4">
      <QuotesContent />
    </div>
  );
}
