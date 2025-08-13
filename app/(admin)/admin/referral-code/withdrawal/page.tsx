import { generatePageMetadata } from "@/lib/metadata";
import ReferralWithdrawalContent from "./components/referral-withdrawal-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Kode Referral" });

export default function ReferralWithdrawalPage() {
  return (
    <div className="space-y-4">
      <ReferralWithdrawalContent />
    </div>
  );
}
