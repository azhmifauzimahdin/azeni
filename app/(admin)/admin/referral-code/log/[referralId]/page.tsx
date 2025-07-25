import { generatePageMetadata } from "@/lib/metadata";
import ReferralCodeLogContent from "./components/referral-code-log-content";

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
      <ReferralCodeLogContent params={params} />
    </div>
  );
}
