import { generatePageMetadata } from "@/lib/metadata";
import InvitationCheckoutForm from "./components/invitation-checkout-form";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Cek Pesanan" });

interface InvitationCheckoutPageProps {
  params: {
    id: string;
  };
}

export default async function InvitationCheckoutPage({
  params,
}: InvitationCheckoutPageProps) {
  return (
    <div className="space-y-4">
      <InvitationCheckoutForm params={params} />
    </div>
  );
}
