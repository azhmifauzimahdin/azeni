import { generatePageMetadata } from "@/lib/metadata";
import InvitationIdContent from "./components/invitation-id-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Kelola Undangan" });

interface InvitationIdPageProps {
  params: {
    id: string;
  };
}

export default function InvitationIdPage({ params }: InvitationIdPageProps) {
  return (
    <div className="space-y-4">
      <InvitationIdContent params={params} />
    </div>
  );
}
