import { generatePageMetadata } from "@/lib/metadata";
import QuoteContent from "./components/quote-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Quote" });

interface InvitationIdPageProps {
  params: {
    id: string;
  };
}

export default function InvitationIdPage({ params }: InvitationIdPageProps) {
  return (
    <div className="space-y-4">
      <QuoteContent params={params} />
    </div>
  );
}
