import { generatePageMetadata } from "@/lib/metadata";
import InvitationContent from "./components/invitation-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Undangan" });

export default function InvitationsPage() {
  return (
    <div className="space-y-4">
      <InvitationContent />
    </div>
  );
}
