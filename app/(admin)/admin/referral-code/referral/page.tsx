import { generatePageMetadata } from "@/lib/metadata";
import ReferralCodesContent from "./components/referral-code-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Kode Referral" });

export default function ReferralCodePage() {
  return (
    <div className="space-y-4">
      <ReferralCodesContent />
    </div>
  );
}
