import { generatePageMetadata } from "@/lib/metadata";
import ReferralCodeIdContent from "./components/referral-code-id-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Transaksi Kode Referral" });

interface ReferralCodeIdPageProps {
  params: {
    referralId: string;
  };
}

export default function ReferralCodeIdPage({
  params,
}: ReferralCodeIdPageProps) {
  return (
    <div className="space-y-4">
      <ReferralCodeIdContent params={params} />
    </div>
  );
}
