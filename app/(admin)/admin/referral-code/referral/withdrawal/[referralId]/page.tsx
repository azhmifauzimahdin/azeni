import { generatePageMetadata } from "@/lib/metadata";
import ReferralCodeWithdrawalContent from "./components/referral-code-withdrawal-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Histori Kode Referral" });

interface ReferralCodeLogPageProps {
  params: {
    referralId: string;
  };
}

export default function ReferralCodeLogPage({
  params,
}: ReferralCodeLogPageProps) {
  return (
    <div className="space-y-4">
      <ReferralCodeWithdrawalContent params={params} />
    </div>
  );
}
