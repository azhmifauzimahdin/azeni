import InvitationForm from "./components/invitation-form";
import { generatePageMetadata } from "@/lib/metadata";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Buat Undangan" });

export default function InvitationPage() {
  return (
    <div className="space-y-4">
      <InvitationForm />
    </div>
  );
}
