import { generatePageMetadata } from "@/lib/metadata";
import InvitationThemeForm from "./components/invitation-theme-form";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Pilih Tema" });

interface InvitationThemePageProps {
  params: {
    id: string;
  };
}

export default async function InvitationThemePage({
  params,
}: InvitationThemePageProps) {
  return (
    <div className="space-y-4">
      <InvitationThemeForm params={params} />
    </div>
  );
}
