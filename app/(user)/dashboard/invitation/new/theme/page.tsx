import { generatePageMetadata } from "@/lib/metadata";
import InvitationThemeForm from "./components/invitation-theme-form";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Pilih Tema" });

export default async function InvitationThemePage() {
  return (
    <div className="space-y-4">
      <InvitationThemeForm />
    </div>
  );
}
