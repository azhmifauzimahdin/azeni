import { generatePageMetadata } from "@/lib/metadata";
import InvitationsContent from "./components/invitations-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Undangan" });

export default function InvitationsPage() {
  return (
    <div className="space-y-4">
      <InvitationsContent />
    </div>
  );
}
