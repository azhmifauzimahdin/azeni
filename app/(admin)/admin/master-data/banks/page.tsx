import { generatePageMetadata } from "@/lib/metadata";
import BanksContent from "./components/banks-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Bank" });

export default function CouplePage() {
  return (
    <div className="space-y-4">
      <BanksContent />
    </div>
  );
}
