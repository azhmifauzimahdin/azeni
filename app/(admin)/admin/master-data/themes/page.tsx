import { generatePageMetadata } from "@/lib/metadata";
import ThemesContent from "./components/themes-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Tema" });

export default function BankPage() {
  return (
    <div className="space-y-4">
      <ThemesContent />
    </div>
  );
}
